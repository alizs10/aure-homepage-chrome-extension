import { BetterTypography } from "@/components/common/BetterTypography";
import Favicon from "@/components/common/Favicon";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { SEARCH_ENGINES, getSearchEngine } from "@/constants/searchEngines";
import {
  checkHostPermissions,
  requestHostPermissions,
  subscribePermissionsChange,
} from "@/lib/browser";
import { useSettingsStore } from "@/stores";
import { toast } from "@/stores/useToastStore";
import type { SearchEngineId, SearchEngineOption } from "@/types";
import { CheckIcon, ExternalLinkIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchTabDetails() {
  const { settings, update } = useSettingsStore();
  const currentEngineId = settings?.search_engine ?? "google";
  const openInNewTab = settings?.open_search_in_new_tab ?? false;

  const [enginePerms, setEnginePerms] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const checkAll = async () => {
      const map: Record<string, boolean> = {};
      for (const engine of SEARCH_ENGINES) {
        if (engine.suggestOrigins && engine.suggestOrigins.length > 0) {
          map[engine.id] = await checkHostPermissions(engine.suggestOrigins);
        } else {
          map[engine.id] = true;
        }
      }
      if (isMounted) setEnginePerms(map);
    };

    void checkAll();
    const unsubscribe = subscribePermissionsChange(() => {
      void checkAll();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleSelectEngine = async (id: SearchEngineId) => {
    if (id === currentEngineId) return;
    const target = getSearchEngine(id);
    await update({ search_engine: id });

    if (target.suggestOrigins && target.suggestOrigins.length > 0) {
      const hasPerm = await checkHostPermissions(target.suggestOrigins);
      if (!hasPerm) {
        const granted = await requestHostPermissions(target.suggestOrigins);
        if (granted) {
          toast.success(
            `Search engine set to ${target.name} (live suggestions enabled)`,
          );
          return;
        }
      }
    }

    toast.success(`Search engine set to ${target.name}`);
  };

  const handleRequestPermission = async (engine: SearchEngineOption) => {
    if (!engine.suggestOrigins || engine.suggestOrigins.length === 0) return;
    const granted = await requestHostPermissions(engine.suggestOrigins);
    if (granted) {
      toast.success(`Live search suggestions enabled for ${engine.name}`);
    } else {
      toast.info(`Permission request cancelled for ${engine.name}`);
    }
  };

  const handleToggleOpenInNewTab = async (checked: boolean) => {
    await update({ open_search_in_new_tab: checked });
    toast.success(
      checked
        ? "Searches will now open in a new tab"
        : "Searches will now open in the current tab",
    );
  };

  return (
    <div className="h-fit flex-1 flex flex-col gap-y-8">
      {/* 🌟 1. Header Information */}
      <BetterTypography variant="sm" className="text-muted-foreground">
        Choose the default search engine and search behavior used for web
        queries from your homepage search bar.
      </BetterTypography>

      {/* 🌟 2. Search Behavior */}
      <div className="flex flex-col gap-y-3">
        <div className="flex-center-between">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Search Behavior
          </BetterTypography>
        </div>

        <div className="p-4 rounded-3xl liquid-glass flex flex-col gap-y-2">
          <div className="flex-center-between">
            <BetterTypography variant="sm" weight="semibold">
              Open Search in New Tab
            </BetterTypography>

            <div className="shrink-0 flex items-center">
              <Toggle
                checked={openInNewTab}
                onCheckedChange={handleToggleOpenInNewTab}
                size="md"
              />
            </div>
          </div>

          <BetterTypography variant="xs" className="text-muted-foreground">
            Open search queries and results in a new tab instead of the current
            tab.
          </BetterTypography>
        </div>
      </div>

      {/* 🌟 3. Search Engines Grid */}
      <div className="flex flex-col gap-y-3">
        <div className="flex-center-between">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Available Search Engines
          </BetterTypography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3.5">
          {SEARCH_ENGINES.map((engine) => {
            const isSelected = engine.id === currentEngineId;
            const hasSuggestPerm =
              !engine.suggestOrigins ||
              engine.suggestOrigins.length === 0 ||
              Boolean(enginePerms[engine.id]);

            return (
              <div
                key={engine.id}
                onClick={() => handleSelectEngine(engine.id)}
                className={`group relative p-4 rounded-3xl liquid-glass border transition-all duration-200 cursor-pointer flex flex-col gap-y-3`}
              >
                <div className="flex items-start justify-between gap-x-3">
                  <div className="flex items-center gap-x-3 min-w-0">
                    <div className="size-10 md:size-14 rounded-full liquid-glass-sm flex-center p-2 md:p-3 shrink-0 overflow-hidden">
                      <Favicon
                        url={engine.url}
                        className="size-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <BetterTypography
                        variant="sm"
                        weight="semibold"
                        className="truncate"
                      >
                        {engine.name}
                      </BetterTypography>
                      <a
                        href={engine.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-muted-foreground font-mono hover:text-primary transition-colors flex items-center gap-x-1 truncate"
                      >
                        <span>{engine.url.replace(/^https?:\/\//, "")}</span>
                        <ExternalLinkIcon className="size-3 opacity-60 group-hover:opacity-100" />
                      </a>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-x-2">
                    {isSelected ? (
                      <>
                        {!hasSuggestPerm && (
                          <Button
                            size="xs"
                            variant="muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequestPermission(engine);
                            }}
                            leftIcon={
                              <SparklesIcon className="size-3 text-primary" />
                            }
                          >
                            <BetterTypography variant="xxs">
                              Enable Suggestions
                            </BetterTypography>
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="primary-active"
                          leftIcon={<CheckIcon className="size-3.5" />}
                        >
                          <BetterTypography variant="xxs">
                            Selected
                          </BetterTypography>
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEngine(engine.id);
                        }}
                      >
                        <BetterTypography variant="xxs">
                          Select
                        </BetterTypography>
                      </Button>
                    )}
                  </div>
                </div>

                <BetterTypography
                  variant="xs"
                  className="text-muted-foreground line-clamp-2"
                >
                  {engine.description}
                </BetterTypography>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
