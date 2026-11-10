import { getTopSites, type TopSite } from "@/lib/browser/top-sites";
import browser from "webextension-polyfill";
import { commands } from "@/lib/commands";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { BetterTypography } from "../common/BetterTypography";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { SparklesIcon } from "lucide-react";
import { toast } from "@/stores/useToastStore";
import {
  checkHostPermissions,
  requestHostPermissions,
  subscribePermissionsChange,
} from "@/lib/browser";
import { sliceText } from "@/helpers";
import { useFavoritesStore, useFoldersStore } from "@/features/bookmarks";
import { isValidUrl } from "./helpers/search";
import type { ComponentProps } from "react";
import { useSettingsStore } from "@/stores";
import {
  getSearchEngine,
  parseEngineCommand,
  filterSearchEngines,
} from "@/constants/searchEngines";

export interface Suggestion {
  id: string | number;
  url: string;
  label: string;
  description?: string;
  source:
    | "google"
    | "top-sites"
    | "command"
    | "history"
    | "favorite"
    | "folder"
    | "direct"
    | "engine";
}

const BADGE_CONFIG: Record<
  Suggestion["source"],
  { variant: ComponentProps<typeof Badge>["variant"]; label: string }
> = {
  google: { variant: "lime", label: "Search" },
  "top-sites": { variant: "cherry", label: "Top Site" },
  command: { variant: "default", label: "Command" },
  favorite: { variant: "orchid", label: "Favorite" },
  folder: { variant: "ocean", label: "Folder" },
  history: { variant: "secondary", label: "History" },
  direct: { variant: "tangerine", label: "Go" },
  engine: { variant: "ocean", label: "Engine" },
};

interface SuggestionsProps {
  searchValue: string;
  isCommandMode: boolean;
  selectedIndex: number; // 🌟 Controlled by parent
  onIndexChange: (index: number | ((prev: number) => number)) => void; // 🌟 Controlled by parent
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  onHighlight?: (suggestion: Suggestion | null) => void;
}

export default function Suggestions({
  searchValue,
  isCommandMode,
  selectedIndex,
  onIndexChange,
  onSuggestionSelect,
  onHighlight,
}: SuggestionsProps) {
  const [topSites, setTopSites] = useState<TopSite[]>([]);
  const [historySuggestions, setHistorySuggestions] = useState<Suggestion[]>(
    [],
  );
  const [engineSuggestions, setEngineSuggestions] = useState<Suggestion[]>([]);

  const searchEngine =
    useSettingsStore((state) => state.settings?.search_engine) ?? "google";
  const activeEngine = getSearchEngine(searchEngine);

  const favorites = useFavoritesStore((state) => state.data);
  const folders = useFoldersStore((state) => state.data);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const folderWebsites = useMemo(() => {
    const sites: { url: string; title: string; folderTitle: string }[] = [];
    folders.forEach((folder) => {
      folder.websites.forEach((site) => {
        sites.push({
          url: site.url,
          title: site.title,
          folderTitle: folder.title,
        });
      });
    });
    return sites;
  }, [folders]);

  const parsedEngine = useMemo(
    () => parseEngineCommand(searchValue),
    [searchValue],
  );
  const isEngineMode = parsedEngine.isEngineMode;
  const targetEngine = parsedEngine.engine;
  const currentActiveEngine = targetEngine ?? activeEngine;

  const requiredOrigins = useMemo(() => {
    return currentActiveEngine.suggestOrigins &&
      currentActiveEngine.suggestOrigins.length > 0
      ? currentActiveEngine.suggestOrigins
      : ["https://suggestqueries.google.com/*"];
  }, [currentActiveEngine]);

  const [hasPermission, setHasPermission] = useState<boolean>(true);

  useEffect(() => {
    getTopSites().then(setTopSites);
  }, []);

  useEffect(() => {
    let isMounted = true;
    checkHostPermissions(requiredOrigins).then((has) => {
      if (isMounted) setHasPermission(has);
    });
    const unsubscribe = subscribePermissionsChange(() => {
      checkHostPermissions(requiredOrigins).then((has) => {
        if (isMounted) setHasPermission(has);
      });
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [requiredOrigins]);

  const handleGrantPermission = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const granted = await requestHostPermissions(requiredOrigins);
      if (granted) {
        setHasPermission(true);
        toast.success(
          `Live ${currentActiveEngine.name} search suggestions enabled!`,
        );
      }
    },
    [requiredOrigins, currentActiveEngine],
  );

  const query = searchValue.toLowerCase().trim();
  const rawQuery = searchValue.trim();

  const isEngineQueryMode = isEngineMode && !!targetEngine;
  const effectiveQuery = isEngineQueryMode ? parsedEngine.query : rawQuery;

  const shouldFetchHistory =
    !isCommandMode && !isEngineMode && query.length > 0;
  const shouldFetchEngineSuggestions =
    !isCommandMode &&
    effectiveQuery.length > 0 &&
    !isValidUrl(effectiveQuery) &&
    hasPermission;

  if (!shouldFetchHistory && historySuggestions.length > 0)
    setHistorySuggestions([]);
  if (!shouldFetchEngineSuggestions && engineSuggestions.length > 0)
    setEngineSuggestions([]);

  const localSuggestions = useMemo(() => {
    if (isCommandMode) {
      const cmdQuery = searchValue.slice(1).toLowerCase().trim();
      if (!cmdQuery) {
        return commands.map((cmd) => ({
          id: cmd.id,
          url: "#",
          label: cmd.label,
          description: cmd.description,
          source: "command" as const,
        }));
      }
      return commands
        .filter(
          (cmd) =>
            cmd.keywords.some((keyword) => keyword.includes(cmdQuery)) ||
            cmd.label.toLowerCase().includes(cmdQuery),
        )
        .map((cmd) => ({
          id: cmd.id,
          url: "#",
          label: cmd.label,
          description: cmd.description,
          source: "command" as const,
        }));
    }

    if (isEngineMode) {
      if (!parsedEngine.hasSpace || !targetEngine) {
        const filtered = filterSearchEngines(parsedEngine.trigger);
        return filtered.map((engine) => ({
          id: `engine-choice-${engine.id}`,
          url: engine.url,
          label: `@${engine.id}`,
          description: `${engine.name} - ${engine.description}`,
          source: "engine" as const,
        }));
      }

      if (!parsedEngine.query) {
        return [
          {
            id: "engine-prompt",
            url: targetEngine.url,
            label: `Search with ${targetEngine.name}`,
            description: targetEngine.description || targetEngine.url,
            source: "engine" as const,
          },
        ];
      }

      return [
        {
          id: "direct-engine-search",
          url: targetEngine.queryUrl(parsedEngine.query),
          label: `Search "${parsedEngine.query}"`,
          description: targetEngine.queryUrl(parsedEngine.query),
          source: "google" as const,
        },
      ];
    }

    const combined: Suggestion[] = [];

    if (isValidUrl(searchValue)) {
      const cleanUrl = searchValue.startsWith("http")
        ? searchValue
        : `https://${searchValue}`;
      combined.push({
        id: "direct",
        url: cleanUrl,
        label: `Go to ${searchValue}`,
        description: "Direct Navigation",
        source: "direct",
      });
    }

    const limit = query.length === 0 ? 5 : 10;

    const filteredTopSites = topSites
      .filter(
        (site) =>
          site.title?.toLowerCase().includes(query) ||
          site.url.toLowerCase().includes(query),
      )
      .slice(0, limit);

    filteredTopSites.forEach((site, index) => {
      combined.push({
        id: `top-${index}`,
        url: site.url,
        label: site.title || site.url,
        description: site.url,
        source: "top-sites",
      });
    });

    const filteredFavorites = favorites
      .filter(
        (fav) =>
          fav.title.toLowerCase().includes(query) ||
          fav.url.toLowerCase().includes(query),
      )
      .slice(0, limit);

    filteredFavorites.forEach((fav) => {
      combined.push({
        id: `fav-${fav.id}`,
        url: fav.url,
        label: fav.title,
        description: fav.url,
        source: "favorite",
      });
    });

    const filteredFolderSites = folderWebsites
      .filter(
        (site) =>
          site.title.toLowerCase().includes(query) ||
          site.url.toLowerCase().includes(query),
      )
      .slice(0, limit);

    filteredFolderSites.forEach((site, index) => {
      combined.push({
        id: `folder-${index}`,
        url: site.url,
        label: site.title,
        description: `${site.folderTitle} Folder`,
        source: "folder",
      });
    });

    return combined;
  }, [
    searchValue,
    isCommandMode,
    isEngineMode,
    parsedEngine,
    targetEngine,
    topSites,
    favorites,
    folderWebsites,
    query,
  ]);

  useEffect(() => {
    if (!shouldFetchHistory) return;
    let isCancelled = false;
    const historyApi =
      typeof browser !== "undefined" && browser.history
        ? browser.history
        : typeof chrome !== "undefined"
          ? chrome.history
          : null;
    if (!historyApi) return;

    historyApi
      .search({ text: query, maxResults: 10 })
      .then((historyItems) => {
        if (isCancelled) return;
        const items: Suggestion[] = [];
        historyItems.forEach((item, index) => {
          if (item.url) {
            items.push({
              id: `history-${index}`,
              url: item.url,
              label: item.title || item.url,
              description: item.url,
              source: "history",
            });
          }
        });
        setHistorySuggestions(items);
      })
      .catch((e) => console.warn("History search failed", e));
    return () => {
      isCancelled = true;
    };
  }, [shouldFetchHistory, query]);

  useEffect(() => {
    if (!shouldFetchEngineSuggestions) return;
    const timer = setTimeout(async () => {
      try {
        const suggestUrl = currentActiveEngine.suggestUrl
          ? currentActiveEngine.suggestUrl(effectiveQuery)
          : `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(effectiveQuery)}`;

        const response = await fetch(suggestUrl);
        const data = await response.json();

        let stringSuggestions: string[] = [];
        if (currentActiveEngine.parseSuggestions) {
          stringSuggestions = currentActiveEngine.parseSuggestions(data);
        } else if (Array.isArray(data) && Array.isArray(data[1])) {
          stringSuggestions = data[1].filter(
            (item): item is string => typeof item === "string",
          );
        }

        const items: Suggestion[] = stringSuggestions
          .slice(0, 10)
          .map((suggestion: string, index: number) => ({
            id: `search-${index}`,
            url: currentActiveEngine.queryUrl(suggestion),
            label: suggestion,
            description: currentActiveEngine.queryUrl(suggestion),
            source: "google",
          }));
        setEngineSuggestions(items);
      } catch (error) {
        // Fallback gracefully to Google if available and engine failed
        if (currentActiveEngine.id !== "google") {
          try {
            const hasGoogle = await checkHostPermissions([
              "https://suggestqueries.google.com/*",
            ]);
            if (hasGoogle) {
              const fallbackRes = await fetch(
                `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(effectiveQuery)}`,
              );
              const data = await fallbackRes.json();
              if (Array.isArray(data) && Array.isArray(data[1])) {
                const items: Suggestion[] = data[1]
                  .slice(0, 10)
                  .map((suggestion: string, index: number) => ({
                    id: `search-${index}`,
                    url: currentActiveEngine.queryUrl(suggestion),
                    label: suggestion,
                    description: currentActiveEngine.queryUrl(suggestion),
                    source: "google",
                  }));
                setEngineSuggestions(items);
                return;
              }
            }
          } catch {
            // Ignore fallback errors
          }
        }
        console.error("Error fetching suggestions:", error);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [shouldFetchEngineSuggestions, effectiveQuery, currentActiveEngine]);

  const suggestions = useMemo(() => {
    return [...localSuggestions, ...historySuggestions, ...engineSuggestions];
  }, [localSuggestions, historySuggestions, engineSuggestions]);

  const headerTitle = useMemo(() => {
    if (isCommandMode) return "Commands";
    if (isEngineMode) {
      if (targetEngine && parsedEngine.hasSpace) {
        return `Search with ${targetEngine.name}`;
      }
      return "Search Engines";
    }
    return "Suggestions";
  }, [isCommandMode, isEngineMode, targetEngine, parsedEngine.hasSpace]);

  const emptyStateMessage = useMemo(() => {
    if (
      isEngineMode &&
      (!parsedEngine.hasSpace || !targetEngine) &&
      parsedEngine.trigger
    ) {
      return `No search engines matching "@${parsedEngine.trigger}"`;
    }
    if (searchValue.trim().length > 0) {
      return "No matches found";
    }
    return "Start typing to see suggestions";
  }, [
    isEngineMode,
    parsedEngine.hasSpace,
    parsedEngine.trigger,
    targetEngine,
    searchValue,
  ]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      if (selectedIndex === 0)
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
      else if (itemRefs.current[selectedIndex])
        itemRefs.current[selectedIndex]?.scrollIntoView({
          block: "nearest",
          behavior: "instant",
        });
    }
  }, [selectedIndex]);

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      if (onSuggestionSelect) onSuggestionSelect(suggestion);
    },
    [onSuggestionSelect],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          onIndexChange((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          onIndexChange((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Tab":
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onIndexChange(-1);
          break;
        default:
          break;
      }
    },
    [suggestions, selectedIndex, handleSuggestionClick, onIndexChange],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      onHighlight?.(suggestions[selectedIndex]);
    } else {
      onHighlight?.(null);
    }
  }, [selectedIndex, suggestions, onHighlight]);

  if (suggestions.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-50">
        <div className="rounded-3xl liquid-glass bg-background/80! overflow-clip">
          <div className="p-4 app-blur bg-background/30 z-10">
            <BetterTypography variant="md" weight="medium">
              {headerTitle}
            </BetterTypography>
          </div>
          <div className="p-6 flex-center">
            <BetterTypography variant="sm" className="text-muted-foreground">
              {emptyStateMessage}
            </BetterTypography>
          </div>
          {!isCommandMode &&
            !hasPermission &&
            effectiveQuery.length > 0 && (
              <div className="p-3 border-t border-border/40 bg-primary/5 flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-2 min-w-0">
                  <SparklesIcon className="size-4 text-primary shrink-0" />
                  <BetterTypography
                    variant="xs"
                    className="text-muted-foreground truncate"
                  >
                    Enable live {currentActiveEngine.name} search completions
                  </BetterTypography>
                </div>
                <Button
                  size="xs"
                  variant="primary"
                  onClick={handleGrantPermission}
                  className="shrink-0 text-xs"
                >
                  Grant Permission
                </Button>
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-50">
      <div className="rounded-3xl liquid-glass bg-background/80! overflow-clip">
        <div
          ref={scrollContainerRef}
          className="flex flex-col max-h-[calc(50vh-3rem)] overflow-y-scroll rounded-3xl scrollbar-none"
        >
          <div className="p-4 app-blur bg-background/30 z-10">
            <BetterTypography variant="md" weight="medium">
              {headerTitle}
            </BetterTypography>
          </div>

          <ul className="flex flex-col overflow-clip">
            {suggestions.map((s, index) => (
              <li
                key={s.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              >
                <a
                  href={s.url}
                  target={s.source === "command" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(s);
                  }}
                  className={`flex justify-between items-center py-2.5 px-5 transition-colors duration-200 ${selectedIndex === index ? "bg-muted" : "bg-transparent hover:bg-muted"}`}
                >
                  <div className="flex flex-col gap-y-0.5 min-w-0 flex-1 pr-4">
                    <BetterTypography
                      variant="sm"
                      weight="medium"
                      className="line-clamp-1"
                    >
                      {s.label}
                    </BetterTypography>
                    <BetterTypography
                      variant="xs"
                      className="text-muted-foreground line-clamp-1"
                    >
                      {sliceText(s.description || s.url, 60)}
                    </BetterTypography>
                  </div>
                  <Badge
                    variant={BADGE_CONFIG[s.source].variant}
                    size="sm"
                    className="shrink-0"
                  >
                    {s.source === "google"
                      ? targetEngine
                        ? targetEngine.name
                        : activeEngine.name
                      : BADGE_CONFIG[s.source].label}
                  </Badge>
                </a>
              </li>
            ))}
          </ul>

          {!isCommandMode &&
            !hasPermission &&
            effectiveQuery.length > 0 && (
              <div className="p-3 border-t border-border/40 bg-primary/5 flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-2 min-w-0">
                  <SparklesIcon className="size-4 text-primary shrink-0" />
                  <BetterTypography
                    variant="xs"
                    className="text-muted-foreground truncate"
                  >
                    Enable live {currentActiveEngine.name} search completions
                  </BetterTypography>
                </div>
                <Button
                  size="xs"
                  variant="primary"
                  onClick={handleGrantPermission}
                  className="shrink-0 text-xs"
                >
                  Grant Permission
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
