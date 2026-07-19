export function getDestination(query: string): string {
    // 1. If it's empty, do nothing
    if (!query || !query.trim()) return "";

    const trimmed = query.trim();

    // 2. Check if it already looks like a valid URL with a protocol
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    // 3. Check if it looks like a domain (e.g., "google.com" or "localhost:3000")
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
        return `https://${trimmed}`;
    }

    // 4. Fallback: Treat it as a Google search query
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}