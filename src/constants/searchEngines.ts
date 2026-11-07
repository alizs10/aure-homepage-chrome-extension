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
  },
  {
    id: "brave",
    name: "Brave Search",
    description: "Independent, private search engine with its own web index.",
    url: "https://search.brave.com",
    queryUrl: (q: string) =>
      `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    keywords: ["brave", "b"],
  },
  {
    id: "bing",
    name: "Bing",
    description: "Microsoft's search engine powered by intelligent features.",
    url: "https://www.bing.com",
    queryUrl: (q: string) =>
      `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    keywords: ["bing"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT Search",
    description: "AI-powered web search directly within ChatGPT.",
    url: "https://chatgpt.com",
    queryUrl: (q: string) =>
      `https://chatgpt.com/?hints=search&ref=ext&q=${encodeURIComponent(q)}`,
    keywords: ["chatgpt", "gpt", "chat", "chat-gpt", "ai"],
  },
  {
    id: "yandex",
    name: "Yandex",
    description: "Comprehensive web search and internet services engine.",
    url: "https://yandex.com",
    queryUrl: (q: string) =>
      `https://yandex.com/search/?text=${encodeURIComponent(q)}`,
    keywords: ["yandex", "y"],
  },
  {
    id: "zarebin",
    name: "Zarebin",
    description: "Iranian intelligent search engine with localized results.",
    url: "https://zarebin.ir",
    queryUrl: (q: string) =>
      `https://zarebin.ir/search?q=${encodeURIComponent(q)}`,
    keywords: ["zarebin", "z"],
  },
  {
    id: "gerdoo",
    name: "Gerdoo",
    description: "Iranian smart search engine with web indexing.",
    url: "https://gerdoo.me",
    queryUrl: (q: string) =>
      `https://gerdoo.me/search/?query=${encodeURIComponent(q)}`,
    keywords: ["gerdoo"],
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
