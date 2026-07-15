import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Typography } from '../common/Typography';
import { getTopSites } from "@/lib/chrome/top-sites";
import { commands } from "@/lib/commands";

export interface Suggestion {
  id: string | number;
  url: string;
  label: string;
  description?: string; // Added for command descriptions
  source: "google" | "top-sites" | "command";
}

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const commandSuggestions = useMemo(() => {
    if (!isCommandMode) return [];

    const query = searchValue.slice(1).toLowerCase().trim();
    if (!query) return commands;

    return commands.filter(cmd => cmd.keywords.includes(query));
  }, [searchValue, isCommandMode]);

  useEffect(() => {
    getTopSites().then(setTopSites);
  }, []);

  useEffect(() => {
    if (isNavigating) return;

    const fetchSuggestions = async () => {
      // 🌟 1. COMMAND MODE: ONLY show commands, skip Google/Top Sites entirely
      if (isCommandMode) {

        const formattedCommands: Suggestion[] = commandSuggestions.map(cmd => ({
          id: cmd.id,
          url: '#',
          label: cmd.label, // Show exactly what the user typed
          description: cmd.description,
          source: "command" as const
        }));
        setSuggestions(formattedCommands);
        setSelectedIndex(-1);
        return; // Exit early
      }

      // 🌟 2. NORMAL SEARCH MODE
      let googleSuggestions: string[] = [];

      if (searchValue.trim().length > 0) {
        try {
          const response = await fetch(
            `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(searchValue)}`
          );
          const data = await response.json();

          if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
            googleSuggestions = data[1];
          }
        } catch (error) {
          console.error("Error fetching Google suggestions:", error);
        }
      }

      const filteredTopSites = topSites
        .filter(site =>
          site.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          site.url.toLowerCase().includes(searchValue.toLowerCase())
        )
        .slice(0, 5);

      const combinedSuggestions: Suggestion[] = [];

      filteredTopSites.forEach((site, index) => {
        combinedSuggestions.push({
          id: `top-${index}`,
          url: site.url,
          label: site.title || site.url,
          source: "top-sites"
        });
      });

      googleSuggestions.forEach((suggestion, index) => {
        combinedSuggestions.push({
          id: `google-${index}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`,
          label: suggestion,
          source: 'google'
        });
      });

      setSuggestions(combinedSuggestions);
      setSelectedIndex(-1);
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, topSites, isNavigating, isCommandMode, commandSuggestions]);

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
      onSearchUpdate(suggestions[selectedIndex].label);
    }
  }, [selectedIndex, suggestions, onSearchUpdate]);

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className='absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-20'
    >
      <div className="app_container app_gradient rounded-3xl overflow-clip">
        <div ref={scrollContainerRef} className="flex flex-col max-h-100 overflow-y-scroll rounded-3xl scrollbar-none">
          <div className="app_gradient app-blur p-5 sticky top-0">
            <Typography variant='h4' weight='medium'>
              {isCommandMode ? 'Commands' : 'Suggestions'}
            </Typography>
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
                  className={`flex justify-between items-start py-2.5 px-5 transition-colors duration-200 ${selectedIndex === index ? 'bg-secondary' : 'bg-background hover:bg-secondary'
                    }`}
                >
                  <div className="flex flex-col gap-y-1">
                    <Typography variant='body' weight='medium'>
                      {s.label}
                    </Typography>
                    <Typography variant='caption-xs' className='text-muted-foreground line-clamp-1'>
                      {/* 🌟 Show description for commands, URL for everything else */}
                      {s.source === 'command' && s.description ? s.description : s.url}
                    </Typography>
                  </div>

                  <Typography
                    variant='caption-xxs'
                    className={`px-2 py-0.5 text-nowrap rounded-3xl ${s.source === 'top-sites'
                      ? 'bg-success text-success-foreground'
                      : s.source === 'command'
                        ? 'bg-primary text-primary-foreground' // Adjust to your theme's accent/primary
                        : "bg-secondary text-foreground"
                      }`}
                  >
                    {s.source === 'google' ? "Google Search" : s.source === 'command' ? "Command" : "Top Site"}
                  </Typography>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}