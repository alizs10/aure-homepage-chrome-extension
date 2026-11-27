import { BetterTypography } from "@/components/common/BetterTypography";
import { SearchEngineIcon } from "@/components/icons";
import Button from "@/components/ui/Button";
import {
  DEFAULT_SEARCH_ENGINE,
  SEARCH_ENGINES,
  getSearchEngine,
} from "@/constants/searchEngines";
import {
  checkHostPermissions,
  requestHostPermissions,
  subscribePermissionsChange,
} from "@/lib/browser";
import { toast } from "@/stores/useToastStore";
import type { SearchEngineId } from "@/types";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface SearchEnginePickerProps {
  selectedId?: SearchEngineId | string;
  onSelect: (engineId: SearchEngineId) => void | Promise<void>;
  gridClassName?: string;
}

/**
 * Displays the grid of available search engines and ensures optional host
 * permissions are requested within the user gesture before selecting an engine.
 */
export function SearchEnginePicker({
  selectedId = DEFAULT_SEARCH_ENGINE,
  onSelect,
  gridClassName = "grid-cols-1 sm:grid-cols-2 gap-3.5",
}: SearchEnginePickerProps) {
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
    if (id === selectedId) return;
    const target = getSearchEngine(id);

    const hasOrigins = Boolean(
      target.suggestOrigins && target.suggestOrigins.length > 0,
    );
    const hasPerm = !hasOrigins || enginePerms[id] === true;

    if (!hasPerm && target.suggestOrigins) {
      // ⚠️ In Firefox, permissions.request() must be invoked directly within
      // the user gesture callback with NO prior await, otherwise Gecko drops the gesture context.
      const granted = await requestHostPermissions(target.suggestOrigins);
      if (!granted) {
        toast.info(`Permission is required to select ${target.name}`);
        return;
      }
      setEnginePerms((prev) => ({ ...prev, [id]: true }));
    }

    await onSelect(id);
  };

  return (
    <div className={`grid ${gridClassName}`}>
      {SEARCH_ENGINES.map((engine) => {
        const isSelected = engine.id === selectedId;

        return (
          <div
            key={engine.id}
            onClick={() => handleSelectEngine(engine.id)}
            className="group relative p-4 rounded-3xl liquid-glass border transition-all duration-200 cursor-pointer flex flex-col gap-y-3"
          >
            <div className="flex items-start justify-between gap-x-3">
              <div className="flex items-center gap-x-3 min-w-0">
                <div className="size-10 md:size-14 rounded-full liquid-glass-sm flex-center p-2 md:p-3 shrink-0 overflow-hidden">
                  <SearchEngineIcon
                    engineId={engine.id}
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
                <Button
                  size="xs"
                  variant={isSelected ? "primary-active" : "ghost"}
                  leftIcon={
                    isSelected ? <CheckIcon className="size-3.5" /> : undefined
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      handleSelectEngine(engine.id);
                    }
                  }}
                >
                  <BetterTypography variant="xxs">
                    {isSelected ? "Selected" : "Select"}
                  </BetterTypography>
                </Button>
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
  );
}
