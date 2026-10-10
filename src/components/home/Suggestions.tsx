import { getTopSites } from "@/lib/chrome/top-sites";
import { commands } from "@/lib/commands";
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { BetterTypography } from "../common/BetterTypography";
import Badge from "../ui/Badge";
import { sliceText } from "@/helpers";
import { useFavoritesStore } from "@/components/settings/components/tabs-details/sites-and-folders/components/favorites/store";
import { useFoldersStore } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/store";
import { isValidUrl } from "./helpers/search";
import type { ComponentProps } from "react";

export interface Suggestion {
  id: string | number;
  url: string;
  label: string;
  description?: string;
  source: "google" | "top-sites" | "command" | "history" | "favorite" | "folder" | "direct";
}

const BADGE_CONFIG: Record<Suggestion['source'], { variant: ComponentProps<typeof Badge>['variant'], label: string }> = {
  google: { variant: 'lime', label: 'Google' },
  'top-sites': { variant: 'cherry', label: 'Top Site' },
  command: { variant: 'default', label: 'Command' },
  favorite: { variant: 'orchid', label: 'Favorite' },
  folder: { variant: 'ocean', label: 'Folder' },
  history: { variant: 'secondary', label: 'History' },
  direct: { variant: 'tangerine', label: 'Go' },
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
  onHighlight
}: SuggestionsProps) {
  const [topSites, setTopSites] = useState<chrome.topSites.MostVisitedURL[]>([]);
  const [historySuggestions, setHistorySuggestions] = useState<Suggestion[]>([]);
  const [googleSuggestions, setGoogleSuggestions] = useState<Suggestion[]>([]);

  const favorites = useFavoritesStore((state) => state.data);
  const folders = useFoldersStore((state) => state.data);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const folderWebsites = useMemo(() => {
    const sites: { url: string; title: string; folderTitle: string }[] = [];
    folders.forEach(folder => {
      folder.websites.forEach(site => {
        sites.push({ url: site.url, title: site.title, folderTitle: folder.title });
      });
    });
    return sites;
  }, [folders]);

  useEffect(() => {
    getTopSites().then(setTopSites);
  }, []);

  const query = searchValue.toLowerCase().trim();
  const rawQuery = searchValue.trim();

  const shouldFetchHistory = !isCommandMode && query.length > 0;
  const shouldFetchGoogle = !isCommandMode && rawQuery.length > 0 && !isValidUrl(rawQuery);

  if (!shouldFetchHistory && historySuggestions.length > 0) setHistorySuggestions([]);
  if (!shouldFetchGoogle && googleSuggestions.length > 0) setGoogleSuggestions([]);

  const localSuggestions = useMemo(() => {
    if (isCommandMode) {
      const cmdQuery = searchValue.slice(1).toLowerCase().trim();
      if (!cmdQuery) {
        return commands.map(cmd => ({
          id: cmd.id, url: '#', label: cmd.label, description: cmd.description, source: "command" as const
        }));
      }
      return commands
        .filter(cmd =>
          cmd.keywords.some(keyword => keyword.includes(cmdQuery)) ||
          cmd.label.toLowerCase().includes(cmdQuery)
        )
        .map(cmd => ({
          id: cmd.id, url: '#', label: cmd.label, description: cmd.description, source: "command" as const
        }));
    }

    const combined: Suggestion[] = [];

    if (isValidUrl(searchValue)) {
      const cleanUrl = searchValue.startsWith('http') ? searchValue : `http://${searchValue}`;
      combined.push({
        id: 'direct', url: cleanUrl, label: `Go to ${searchValue}`, description: 'Direct Navigation', source: 'direct'
      });
    }

    const limit = query.length === 0 ? 5 : 10;

    const filteredTopSites = topSites
      .filter(site => site.title?.toLowerCase().includes(query) || site.url.toLowerCase().includes(query))
      .slice(0, limit);

    filteredTopSites.forEach((site, index) => {
      combined.push({ id: `top-${index}`, url: site.url, label: site.title || site.url, source: "top-sites" });
    });

    const filteredFavorites = favorites
      .filter(fav => fav.title.toLowerCase().includes(query) || fav.url.toLowerCase().includes(query))
      .slice(0, limit);

    filteredFavorites.forEach((fav) => {
      combined.push({ id: `fav-${fav.id}`, url: fav.url, label: fav.title, description: fav.url, source: "favorite" });
    });

    const filteredFolderSites = folderWebsites
      .filter(site => site.title.toLowerCase().includes(query) || site.url.toLowerCase().includes(query))
      .slice(0, limit);

    filteredFolderSites.forEach((site, index) => {
      combined.push({ id: `folder-${index}`, url: site.url, label: site.title, description: `${site.folderTitle} Folder`, source: "folder" });
    });

    return combined;
  }, [searchValue, isCommandMode, topSites, favorites, folderWebsites, query]);

  useEffect(() => {
    if (!shouldFetchHistory) return;
    let isCancelled = false;
    chrome.history.search({ text: query, maxResults: 10 }).then(historyItems => {
      if (isCancelled) return;
      const items: Suggestion[] = [];
      historyItems.forEach((item, index) => {
        if (item.url) {
          items.push({ id: `history-${index}`, url: item.url, label: item.title || item.url, description: item.url, source: "history" });
        }
      });
      setHistorySuggestions(items);
    }).catch(e => console.warn("History search failed", e));
    return () => { isCancelled = true; };
  }, [shouldFetchHistory, query]);

  useEffect(() => {
    if (!shouldFetchGoogle) return;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(rawQuery)}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
          const items: Suggestion[] = data[1].slice(0, 10).map((suggestion: string, index: number) => ({
            id: `google-${index}`, url: `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`, label: suggestion, source: 'google'
          }));
          setGoogleSuggestions(items);
        }
      } catch (error) {
        console.error("Error fetching Google suggestions:", error);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [shouldFetchGoogle, rawQuery]);

  const suggestions = useMemo(() => {
    return [...localSuggestions, ...historySuggestions, ...googleSuggestions];
  }, [localSuggestions, historySuggestions, googleSuggestions]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      if (selectedIndex === 0) scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      else if (itemRefs.current[selectedIndex]) itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  }, [selectedIndex]);

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    if (onSuggestionSelect) onSuggestionSelect(suggestion);
  }, [onSuggestionSelect]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        onIndexChange(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        onIndexChange(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onIndexChange(-1);
        break;
      default:
        break;
    }
  }, [suggestions, selectedIndex, handleSuggestionClick, onIndexChange]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
      <div className='absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-50'>
        <div className="rounded-3xl liquid-glass bg-background/80! overflow-clip">
          <div className="p-4 app-blur bg-background/30 z-10">
            <BetterTypography variant="md" weight="medium">
              {isCommandMode ? "Commands" : "Suggestions"}
            </BetterTypography>
          </div>
          <div className="p-6 flex-center">
            <BetterTypography variant="sm" className="text-muted-foreground">
              {searchValue.trim().length > 0 ? "No matches found" : "Start typing to see suggestions"}
            </BetterTypography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-50'>
      <div className="rounded-3xl liquid-glass bg-background/80! overflow-clip">
        <div ref={scrollContainerRef} className="flex flex-col max-h-[calc(50vh-3rem)] overflow-y-scroll rounded-3xl scrollbar-none">
          <div className="p-4 app-blur bg-background/30 z-10">
            <BetterTypography variant="md" weight="medium">
              {isCommandMode ? "Commands" : "Suggestions"}
            </BetterTypography>
          </div>

          <ul className='flex flex-col overflow-clip'>
            {suggestions.map((s, index) => (
              <li key={s.id} ref={(el) => { itemRefs.current[index] = el; }}>
                <a
                  href={s.url}
                  target={s.source === 'command' ? '_self' : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => { e.preventDefault(); handleSuggestionClick(s); }}
                  className={`flex justify-between items-center py-2.5 px-5 transition-colors duration-200 ${selectedIndex === index ? 'bg-muted' : 'bg-transparent hover:bg-muted'}`}
                >
                  <div className="flex flex-col gap-y-0.5 min-w-0 flex-1 pr-4">
                    <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                      {s.label}
                    </BetterTypography>
                    <BetterTypography variant="xs" className="text-muted-foreground line-clamp-1">
                      {sliceText(s.description || s.url, 60)}
                    </BetterTypography>
                  </div>
                  <Badge variant={BADGE_CONFIG[s.source].variant} size="sm" className="shrink-0">
                    {BADGE_CONFIG[s.source].label}
                  </Badge>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}