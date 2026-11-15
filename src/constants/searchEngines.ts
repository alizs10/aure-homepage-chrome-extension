import type { SearchEngineId, SearchEngineOption } from "@/types";

export const DEFAULT_SEARCH_ENGINE: SearchEngineId = "google";

export const SEARCH_ENGINES: SearchEngineOption[] = [
  {
    id: "google",
    name: "Google",
    description: "The most widely used search engine worldwide.",
    url: "https://www.google.com",
    queryUrl: (q: string) =>
      `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    keywords: ["google", "g"],
    suggestUrl: (q: string) =>
      `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`,
    suggestOrigins: ["https://suggestqueries.google.com/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].filter((item): item is string => typeof item === "string");
      }
      return [];
    },
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    description:
      "Privacy-first search engine that does not track your searches.",
    url: "https://duckduckgo.com",
    queryUrl: (q: string) =>
      `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    keywords: ["duckduckgo", "ddg", "duck", "d"],
    suggestUrl: (q: string) =>
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`,
    suggestOrigins: ["https://duckduckgo.com/*", "https://*.duckduckgo.com/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data)) {
        if (Array.isArray(data[1])) {
          return data[1].filter((item): item is string => typeof item === "string");
        }
        if (
          data.every(
            (item) => typeof item === "object" && item !== null && "phrase" in item,
          )
        ) {
          return data.map((item: { phrase: string }) => item.phrase);
        }
        if (data.every((item) => typeof item === "string")) {
          return data;
        }
      }
      return [];
    },
  },
  {
    id: "brave",
    name: "Brave Search",
    description: "Independent, private search engine with its own web index.",
    url: "https://search.brave.com",
    queryUrl: (q: string) =>
      `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    keywords: ["brave", "b"],
    suggestUrl: (q: string) =>
      `https://search.brave.com/api/suggest?q=${encodeURIComponent(q)}`,
    suggestOrigins: ["https://search.brave.com/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].filter((item): item is string => typeof item === "string");
      }
      return [];
    },
  },
  {
    id: "bing",
    name: "Bing",
    description: "Microsoft's search engine powered by intelligent features.",
    url: "https://www.bing.com",
    queryUrl: (q: string) =>
      `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    keywords: ["bing"],
    suggestUrl: (q: string) =>
      `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`,
    suggestOrigins: ["https://api.bing.com/*", "https://*.bing.com/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].filter((item): item is string => typeof item === "string");
      }
      return [];
    },
  },
  {
    id: "chatgpt",
    name: "ChatGPT Search",
    description: "AI-powered web search directly within ChatGPT.",
    url: "https://chatgpt.com",
    queryUrl: (q: string) =>
      `https://chatgpt.com/?hints=search&ref=ext&q=${encodeURIComponent(q)}`,
    keywords: ["chatgpt", "gpt", "chat", "chat-gpt", "ai"],
    suggestUrl: (q: string) =>
      `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`,
    suggestOrigins: ["https://suggestqueries.google.com/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].filter((item): item is string => typeof item === "string");
      }
      return [];
    },
  },
  {
    id: "yandex",
    name: "Yandex",
    description: "Comprehensive web search and internet services engine.",
    url: "https://yandex.com",
    queryUrl: (q: string) =>
      `https://yandex.com/search/?text=${encodeURIComponent(q)}`,
    keywords: ["yandex", "y"],
    suggestUrl: (q: string) =>
      `https://suggest.yandex.com/suggest-ya.cgi?v=4&part=${encodeURIComponent(q)}`,
    suggestOrigins: ["https://suggest.yandex.com/*", "https://*.yandex.com/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].filter((item): item is string => typeof item === "string");
      }
      return [];
    },
  },
  {
    id: "gerdoo",
    name: "Gerdoo",
    description: "Iranian smart search engine with web indexing.",
    url: "https://gerdoo.me",
    queryUrl: (q: string) =>
      `https://gerdoo.me/search/?query=${encodeURIComponent(q)}`,
    keywords: ["gerdoo"],
    suggestUrl: (q: string) =>
      `https://gerdoo.me/meta_search/get_suggestions/?query=${encodeURIComponent(q)}`,
    suggestOrigins: ["https://gerdoo.me/*", "https://*.gerdoo.me/*"],
    parseSuggestions: (data: unknown) => {
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].filter((item): item is string => typeof item === "string");
      }
      return [];
    },
  },
];

export function getSearchEngine(
  id?: SearchEngineId | string,
): SearchEngineOption {
  return SEARCH_ENGINES.find((engine) => engine.id === id) || SEARCH_ENGINES[0];
}

export interface ParsedEngineCommand {
  isEngineMode: boolean;
  engine: SearchEngineOption | null;
  trigger: string;
  query: string;
  hasSpace: boolean;
}

export function findSearchEngineByTrigger(
  trigger: string,
): SearchEngineOption | undefined {
  const normalized = trigger.toLowerCase().trim();
  if (!normalized) return undefined;

  return SEARCH_ENGINES.find(
    (engine) =>
      engine.id.toLowerCase() === normalized ||
      engine.name.toLowerCase() === normalized ||
      engine.keywords?.some((k) => k.toLowerCase() === normalized),
  );
}

export function filterSearchEngines(query: string): SearchEngineOption[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return SEARCH_ENGINES;

  return SEARCH_ENGINES.filter(
    (engine) =>
      engine.id.toLowerCase().includes(normalized) ||
      engine.name.toLowerCase().includes(normalized) ||
      engine.keywords?.some((k) => k.toLowerCase().includes(normalized)),
  );
}

export function parseEngineCommand(input: string): ParsedEngineCommand {
  const trimmedInput = input.trimStart();
  if (!trimmedInput.startsWith("@")) {
    return {
      isEngineMode: false,
      engine: null,
      trigger: "",
      query: "",
      hasSpace: false,
    };
  }

  const withoutAt = trimmedInput.slice(1);
  const spaceIndex = withoutAt.indexOf(" ");

  if (spaceIndex === -1) {
    const trigger = withoutAt.toLowerCase();
    const engine = findSearchEngineByTrigger(trigger) ?? null;
    return {
      isEngineMode: true,
      engine,
      trigger,
      query: "",
      hasSpace: false,
    };
  }

  const trigger = withoutAt.slice(0, spaceIndex).toLowerCase();
  const query = withoutAt.slice(spaceIndex + 1).trim();
  const engine = findSearchEngineByTrigger(trigger) ?? null;

  return {
    isEngineMode: true,
    engine,
    trigger,
    query,
    hasSpace: true,
  };
}
