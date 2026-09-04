import { getTopSites } from "@/lib/chrome/top-sites";
import { commands } from "@/lib/commands";
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { BetterTypography } from "../common/BetterTypography";
import Badge from "../ui/Badge"; // 🌟 Added Badge import
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

// 🌟 Clean configuration map for Badge variants and labels
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
  isNavigating?: boolean;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  onSearchUpdate?: (value: string) => void;
}

export default function Suggestions({
  searchValue,
  isCommandMode,
  isNavigating = false,
  onSuggestionSelect,
  onSearchUpdate
}: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [topSites, setTopSites] = useState<chrome.topSites.MostVisitedURL[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

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

  useEffect(() => {
    if (isNavigating) return;

    const fetchSuggestions = async () => {
      if (isCommandMode) {
        const query = searchValue.slice(1).toLowerCase().trim();

        if (!query) {
          const formattedCommands: Suggestion[] = commands.map(cmd => ({
            id: cmd.id, url: '#', label: cmd.label, description: cmd.description, source: "command" as const
          }));
          setSuggestions(formattedCommands);
          setSelectedIndex(-1);
          return;
        }

        const commandSuggestions = commands.filter(cmd =>
          cmd.keywords.some(keyword => keyword.includes(query)) ||
          cmd.label.toLowerCase().includes(query)
        );

        setSuggestions(commandSuggestions.map(cmd => ({
          id: cmd.id, url: '#', label: cmd.label, description: cmd.description, source: "command" as const
        })));
        setSelectedIndex(-1);
        return;
      }

      const query = searchValue.toLowerCase().trim();
      const combinedSuggestions: Suggestion[] = [];

      if (isValidUrl(searchValue)) {
        const cleanUrl = searchValue.startsWith('http') ? searchValue : `http://${searchValue}`;
        combinedSuggestions.push({
          id: 'direct',
          url: cleanUrl,
          label: `Go to ${searchValue}`,
          description: 'Direct Navigation',
          source: 'direct'
        });
      }

      const filteredTopSites = topSites
        .filter(site => site.title?.toLowerCase().includes(query) || site.url.toLowerCase().includes(query))
        .slice(0, 3);

      filteredTopSites.forEach((site, index) => {
        combinedSuggestions.push({
          id: `top-${index}`, url: site.url, label: site.title || site.url, source: "top-sites"
        });
      });

      const filteredFavorites = favorites
        .filter(fav => fav.title.toLowerCase().includes(query) || fav.url.toLowerCase().includes(query))
        .slice(0, 3);

      filteredFavorites.forEach((fav) => {
        combinedSuggestions.push({
          id: `fav-${fav.id}`, url: fav.url, label: fav.title, description: fav.url, source: "favorite"
        });
      });

      const filteredFolderSites = folderWebsites
        .filter(site => site.title.toLowerCase().includes(query) || site.url.toLowerCase().includes(query))
        .slice(0, 3);

      filteredFolderSites.forEach((site, index) => {
        combinedSuggestions.push({
          id: `folder-${index}`, url: site.url, label: site.title, description: `${site.folderTitle} Folder`, source: "folder"
        });
      });

      if (query.length > 0) {
        try {
          const historyItems = await chrome.history.search({ text: query, maxResults: 5 });
          historyItems.forEach((item, index) => {
            if (item.url) {
              combinedSuggestions.push({
                id: `history-${index}`, url: item.url, label: item.title || item.url, description: item.url, source: "history"
              });
            }
          });
        } catch (e) {
          console.warn("History search failed", e);
        }
      }

      if (searchValue.trim().length > 0 && !isValidUrl(searchValue)) {
        try {
          const response = await fetch(
            `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(searchValue)}`
          );
          const data = await response.json();

          if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
            data[1].slice(0, 3).forEach((suggestion: string, index: number) => {
              combinedSuggestions.push({
                id: `google-${index}`,
                url: `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`,
                label: suggestion,
                source: 'google'
              });
            });
          }
        } catch (error) {
          console.error("Error fetching Google suggestions:", error);
        }
      }

      setSuggestions(combinedSuggestions.slice(0, 10));
      setSelectedIndex(-1);
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 150);

    return () => clearTimeout(timer);
  }, [searchValue, topSites, favorites, folderWebsites, isNavigating, isCommandMode]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      if (selectedIndex === 0) {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (itemRefs.current[selectedIndex]) {
        itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  }, [onSuggestionSelect]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
      default:
        setSelectedIndex(-1);
        break;
    }
  }, [suggestions, selectedIndex, handleSuggestionClick]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length && onSearchUpdate) {
      if (suggestions[selectedIndex].source !== 'direct') {
        onSearchUpdate(suggestions[selectedIndex].label);
      }
    }
  }, [selectedIndex, suggestions, onSearchUpdate]);

  if (suggestions.length === 0) return null;

  return (
    <div
      className='absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-50'
    >
      <div className="rounded-3xl liquid-glass bg-background/80! overflow-clip">
        <div ref={scrollContainerRef} className="flex flex-col max-h-100 overflow-y-scroll rounded-3xl scrollbar-none">
          <div className="p-4 sticky top-0 app-blur bg-background/30 z-10">
            <BetterTypography variant="md" weight="medium">
              {isCommandMode ? "Commands" : "Suggestions"}
            </BetterTypography>
          </div>

          <ul className='flex flex-col overflow-clip'>
            {suggestions.map((s, index) => (
              <li
                key={s.id}
                ref={(el) => { itemRefs.current[index] = el; }}
              >
                <a
                  href={s.url}
                  target={s.source === 'command' ? '_self' : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(s);
                  }}
                  className={`flex justify-between items-center py-2.5 px-5 transition-colors duration-200 ${selectedIndex === index ? 'bg-secondary/50' : 'bg-transparent hover:bg-secondary/30'}`}
                >
                  <div className="flex flex-col gap-y-0.5 min-w-0 flex-1 pr-4">
                    <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                      {s.label}
                    </BetterTypography>

                    <BetterTypography
                      variant="xs"
                      className="text-muted-foreground line-clamp-1"
                    >
                      {sliceText(s.description || s.url, 60)}
                    </BetterTypography>
                  </div>

                  {/* 🌟 Replaced massive conditional string with clean Badge component */}
                  <Badge
                    variant={BADGE_CONFIG[s.source].variant}
                    size="sm"
                    className="shrink-0"
                  >
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