import { BetterTypography } from "@/components/common/BetterTypography";
import Favicon from "@/components/common/Favicon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SEARCH_ENGINES, getSearchEngine } from "@/constants/searchEngines";
import { useSettingsStore } from "@/stores";
import { toast } from "@/stores/useToastStore";
import type { SearchEngineId } from "@/types";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";

export default function SearchTabDetails() {
  const { settings, update } = useSettingsStore();
  const currentEngineId = settings?.search_engine ?? "google";
  const activeEngine = getSearchEngine(currentEngineId);

  const handleSelectEngine = async (id: SearchEngineId) => {
    if (id === currentEngineId) return;
    const target = getSearchEngine(id);
    await update({ search_engine: id });
    toast.success(`Search engine set to ${target.name}`);
  };

  return (
    <div className="h-fit flex-1 flex flex-col gap-y-8">
      {/* 🌟 1. Header Information */}
      <div className="flex flex-col gap-y-2">
        <BetterTypography variant="sm" className="text-muted-foreground">
          Choose the default search engine used for web queries from your
          homepage search bar.
        </BetterTypography>
      </div>

      {/* 🌟 2. Search Engines Grid */}
      <div className="flex flex-col gap-y-3">
        <div className="flex-center-between">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Available Search Engines
          </BetterTypography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3.5">
          {SEARCH_ENGINES.map((engine) => {
            const isSelected = engine.id === currentEngineId;

            return (
              <div
                key={engine.id}
                onClick={() => handleSelectEngine(engine.id)}
                className={`group relative p-4 rounded-3xl liquid-glass border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-y-3`}
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

                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <Button
                        size="xs"
                        variant="primary-active"
                        leftIcon={<CheckIcon className="size-3.5" />}
                      >
                        <BetterTypography variant="xxs">
                          Selected
                        </BetterTypography>
                      </Button>
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
