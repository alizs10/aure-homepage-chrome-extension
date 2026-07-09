import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { Typography } from '../common/Typography';
import { getTopSites } from "@/lib/chrome/top-sites";

interface Suggestion {
  id: string | number;
  url: string;
  label: string;
  source: "google" | "top-sites"
}

interface SuggestionsProps {
  searchValue: string;
}

export default function Suggestions({ searchValue }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [topSites, setTopSites] = useState<chrome.topSites.MostVisitedURL[]>([]);

  // Fetch top sites once on component mount
  useEffect(() => {
    getTopSites().then(setTopSites);
  }, []);

  // Fetch Google suggestions and filter top sites when searchValue changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      let googleSuggestions: string[] = [];

      if (searchValue.trim().length > 0) {
        try {
          // Google Suggest API (returns JSON array)
          const response = await fetch(
            `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(searchValue)}`
          );
          const data = await response.json();

          // The response format is typically ["query", ["suggestion1", "suggestion2", ...]]
          if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
            googleSuggestions = data[1];
          }
        } catch (error) {
          console.error("Error fetching Google suggestions:", error);
        }
      }

      // Filter top sites based on searchValue (matches title or URL)
      const filteredTopSites = topSites
        .filter(site =>
          site.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          site.url.toLowerCase().includes(searchValue.toLowerCase())
        )
        .slice(0, 5); // Limit to top 5 sites to save space

      const combinedSuggestions: Suggestion[] = [];

      // 1. Add filtered top sites first
      filteredTopSites.forEach((site, index) => {
        combinedSuggestions.push({
          id: `top-${index}`,
          url: site.url,
          label: site.title || site.url,
          source: "top-sites"
        });
      });

      // 2. Add Google search suggestions
      googleSuggestions.forEach((suggestion, index) => {
        combinedSuggestions.push({
          id: `google-${index}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`,
          label: suggestion,
          source: 'google'
        });
      });

      setSuggestions(combinedSuggestions);
    };

    // Debounce the API call by 300ms to avoid excessive requests while typing
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, topSites]);

  if (suggestions.length === 0) return;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className='absolute top-full left-0 right-0 px-4 md:px-8 lg:px-10 mt-4 z-20'
    >

      <div className="app_container app_gradient rounded-3xl overflow-clip">

        <div className="flex flex-col max-h-100 overflow-y-scroll rounded-3xl scrollbar-none">
          <div className="app_gradient app-blur p-5 sticky top-0">
            <Typography className='' variant='h4' weight='medium'>
              Suggestions
            </Typography>
          </div>

          <ul className='flex flex-col overflow-clip'>
            {suggestions.map(s => (
              <li key={s.id}>
                {/* Changed to standard <a> tag to properly handle external URLs in Chrome extensions */}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='flex justify-between items-start py-2.5 px-5 bg-background hover:bg-secondary transition-colors duration-200'
                >
                  <div className="flex flex-col gap-y-1">
                    <Typography variant='body' weight='medium'>
                      {s.label}
                    </Typography>
                    <Typography variant='caption-xs' className='text-muted-foreground line-clamp-1'>
                      {s.url}
                    </Typography>
                  </div>

                  <Typography variant='caption-xxs' className={`px-2 py-0.5 ${s.source === 'top-sites' ? 'bg-success text-success-foreground' : "bg-secondary text-foreground"} text-nowrap rounded-3xl`}>
                    {s.source === 'google' ? "google search" : "Top Site"}
                  </Typography>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </motion.div>
  )
}