import { useQuery } from "@tanstack/react-query";
import { storage } from "@/lib/storage";

function getDomain(url: string): string | null {
    // Block empty or invalid inputs immediately
    if (!url || typeof url !== "string") return null;

    try {
        const parsed = new URL(url);
        // Only allow http and https protocols (blocks chrome://, about:, etc.)
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }
        return parsed.hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
}

function isLocalhost(url: string): boolean {
    if (!url || typeof url !== "string") return true;
    return /^https?:\/\/(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(url);
}

export function useFavicon(url: string) {
    const domain = getDomain(url);
    const isLocal = isLocalhost(url);

    return useQuery({
        queryKey: ["favicon", domain],
        queryFn: async () => {
            // Early exit for local or invalid domains
            if (isLocal || !domain) return null;

            const storageKey = `favicon_b64_${domain}`;

            // 1. Check Storage first (Instant offline cache)
            const cached = await storage.get<string>(storageKey);
            if (cached) {
                return cached;
            }

            // 2. Ask background script to fetch from Google API
            try {
                const response = await chrome.runtime.sendMessage({
                    type: "GET_FAVICON",
                    domain: domain,
                });

                const base64Icon = response?.icon || null;

                // 3. Cache the Base64 string for future instant loads
                if (base64Icon) {
                    await storage.set(storageKey, base64Icon);
                }

                return base64Icon;
            } catch (error) {
                console.warn("Failed to get favicon from background script", error);
                return null;
            }
        },
        staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
        retry: 1,
    });
}