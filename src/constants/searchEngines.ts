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
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    description:
      "Privacy-first search engine that does not track your searches.",
    url: "https://duckduckgo.com",
    queryUrl: (q: string) =>
      `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  },
  {
    id: "brave",
    name: "Brave Search",
    description: "Independent, private search engine with its own web index.",
    url: "https://search.brave.com",
    queryUrl: (q: string) =>
      `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "bing",
    name: "Bing",
    description: "Microsoft's search engine powered by intelligent features.",
    url: "https://www.bing.com",
    queryUrl: (q: string) =>
      `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "chatgpt",
    name: "ChatGPT Search",
    description: "AI-powered web search directly within ChatGPT.",
    url: "https://chatgpt.com",
    queryUrl: (q: string) =>
      `https://chatgpt.com/?hints=search&ref=ext&q=${encodeURIComponent(q)}`,
  },
  {
    id: "yandex",
    name: "Yandex",
    description: "Comprehensive web search and internet services engine.",
    url: "https://yandex.com",
    queryUrl: (q: string) =>
      `https://yandex.com/search/?text=${encodeURIComponent(q)}`,
  },
  {
    id: "zarebin",
    name: "Zarebin",
    description: "Iranian intelligent search engine with localized results.",
    url: "https://zarebin.ir",
    queryUrl: (q: string) =>
      `https://zarebin.ir/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "gerdoo",
    name: "Gerdoo",
    description: "Iranian smart search engine with web indexing.",
    url: "https://gerdoo.me",
    queryUrl: (q: string) =>
      `https://gerdoo.me/search/?query=${encodeURIComponent(q)}`,
  },
];

export function getSearchEngine(
  id?: SearchEngineId | string,
): SearchEngineOption {
  return SEARCH_ENGINES.find((engine) => engine.id === id) || SEARCH_ENGINES[0];
}
