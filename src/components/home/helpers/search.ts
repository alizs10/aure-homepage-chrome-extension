/**
 * Validates if a string is a navigable URL.
 * Catches localhost, IP addresses, standard domains, and URLs with protocols.
 */
export function isValidUrl(string: string): boolean {
    if (!string) return false;

    const trimmed = string.trim();

    // 1. Check for localhost or IP addresses with optional ports and paths
    if (/^(localhost|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/.test(trimmed)) {
        return true;
    }

    // 2. Check for standard URLs with protocols
    try {
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            new URL(trimmed);
            return true;
        }
        // 3. Check for domain-like strings (contains a dot, no spaces)
        if (/^[^\s]+\.[^\s]+$/.test(trimmed)) {
            new URL(`http://${trimmed}`);
            return true;
        }
    } catch {
        return false;
    }

    return false;
}

/**
 * Returns the destination URL for a search query.
 * Returns null if the query is empty.
 */
export function getDestination(query: string): string | null {
    if (!query || !query.trim()) return null;

    const trimmed = query.trim();

    // If it's a valid URL, navigate directly (prepend http:// if missing)
    if (isValidUrl(trimmed)) {
        return trimmed.startsWith('http') ? trimmed : `http://${trimmed}`;
    }

    // Otherwise, fallback to Google Search
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}