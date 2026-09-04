const FAVICON_PATH = '_favicon/';

export function getFaviconUrl(
    pageUrl: string,
    size = 128
): string {
    const faviconUrl = new URL(chrome.runtime.getURL(FAVICON_PATH));

    try {
        const parsed = new URL(pageUrl);
        // Normalize: Use origin (e.g., "https://maps.google.com") without trailing slashes or subpaths
        const normalizedUrl = parsed.origin;
        faviconUrl.searchParams.set('pageUrl', normalizedUrl);
    } catch {
        faviconUrl.searchParams.set('pageUrl', pageUrl);
    }

    faviconUrl.searchParams.set('size', String(size));
    return faviconUrl.toString();
}