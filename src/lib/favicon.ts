import browser from 'webextension-polyfill';
import { db } from './db';

export const isFirefox =
    import.meta.env.VITE_TARGET_BROWSER === 'firefox' ||
    (typeof navigator !== 'undefined' && /firefox|fxios/i.test(navigator.userAgent));

export const FAVICON_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// In-memory cache for ultra-fast, synchronous frame-0 lookups
const memoryCache = new Map<string, string>();
const inFlightFetches = new Map<string, Promise<string | null>>();
const failedDomains = new Set<string>();

export function extractDomain(pageUrl: string): string {
    if (!pageUrl) return '';
    try {
        const urlStr = pageUrl.includes('://') ? pageUrl : `https://${pageUrl}`;
        const parsed = new URL(urlStr);
        return parsed.hostname;
    } catch {
        return pageUrl.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0].split('#')[0];
    }
}

export function getChromeFaviconUrl(normalizedUrl: string, size = 128): string | null {
    try {
        const runtime =
            typeof browser !== 'undefined' && browser.runtime
                ? browser.runtime
                : typeof chrome !== 'undefined'
                    ? chrome.runtime
                    : null;

        if (runtime?.getURL) {
            const faviconUrl = new URL(runtime.getURL('_favicon/'));
            faviconUrl.searchParams.set('pageUrl', normalizedUrl);
            faviconUrl.searchParams.set('size', String(size));
            return faviconUrl.toString();
        }
    } catch (e) {
        console.warn('Failed to build chrome favicon URL', e);
    }
    return null;
}

/**
 * Preloads cached favicons from IndexedDB into memoryCache on startup.
 * Stale entries (>7 days) are revalidated in the background.
 */
let hasPreloaded = false;
export async function preloadFaviconCache(): Promise<void> {
    if (hasPreloaded || !isFirefox) return;
    hasPreloaded = true;
    try {
        const cached = await db.cachedFavicons.toArray();
        const now = Date.now();
        for (const item of cached) {
            memoryCache.set(item.domain, item.dataUrl);
            if (now - item.updatedAt > FAVICON_TTL_MS) {
                void fetchFaviconAsBase64(item.domain);
            }
        }
    } catch (e) {
        console.warn('Failed to preload favicon cache:', e);
    }
}

/**
 * Fetches the favicon from FaviconAPI, converts it to base64 data URI, and saves it to IndexedDB.
 */
export async function fetchFaviconAsBase64(domain: string): Promise<string | null> {
    if (!domain || failedDomains.has(domain)) return null;

    if (inFlightFetches.has(domain)) {
        return inFlightFetches.get(domain)!;
    }

    const fetchPromise = (async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(`https://faviconapi.com/${encodeURIComponent(domain)}`, {
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                failedDomains.add(domain);
                return null;
            }

            const blob = await response.blob();
            if (!blob || blob.size === 0 || !blob.type.startsWith('image/')) {
                failedDomains.add(domain);
                return null;
            }

            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        resolve(reader.result);
                    } else {
                        reject(new Error('Failed to read image as data URL'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            memoryCache.set(domain, dataUrl);
            failedDomains.delete(domain);

            try {
                await db.cachedFavicons.put({
                    domain,
                    dataUrl,
                    updatedAt: Date.now(),
                });
            } catch (err) {
                console.warn(`Failed to save favicon for ${domain} to IndexedDB:`, err);
            }

            return dataUrl;
        } catch (e) {
            console.warn(`Failed to fetch favicon for ${domain}:`, e);
            failedDomains.add(domain);
            return null;
        } finally {
            inFlightFetches.delete(domain);
        }
    })();

    inFlightFetches.set(domain, fetchPromise);
    return fetchPromise;
}

/**
 * Retrieves the base64 data URL for a given page URL from memoryCache, IndexedDB, or FaviconAPI.
 */
export async function getFaviconDataUrl(pageUrl: string): Promise<string | null> {
    const domain = extractDomain(pageUrl);
    if (!domain) return null;

    const inMemory = memoryCache.get(domain);
    if (inMemory) return inMemory;

    if (failedDomains.has(domain)) return null;

    try {
        const record = await db.cachedFavicons.get(domain);
        if (record) {
            memoryCache.set(domain, record.dataUrl);

            // Stale-while-revalidate if expired (> 7 days)
            if (Date.now() - record.updatedAt > FAVICON_TTL_MS) {
                void fetchFaviconAsBase64(domain);
            }

            return record.dataUrl;
        }
    } catch (e) {
        console.warn(`IndexedDB lookup failed for ${domain}:`, e);
    }

    return await fetchFaviconAsBase64(domain);
}

/**
 * Returns synchronous initial src if available immediately (e.g. Chrome's _favicon or memory cache).
 */
export function getInitialFaviconSrc(pageUrl: string, size = 128): string | null {
    if (!pageUrl) return null;

    let normalizedUrl = pageUrl;
    try {
        const parsed = new URL(pageUrl.includes('://') ? pageUrl : `https://${pageUrl}`);
        normalizedUrl = parsed.origin;
    } catch {
        // Fallback
    }

    if (!isFirefox) {
        return (
            getChromeFaviconUrl(normalizedUrl, size) ??
            (extractDomain(pageUrl)
                ? `https://faviconapi.com/${encodeURIComponent(extractDomain(pageUrl))}`
                : null)
        );
    }

    const domain = extractDomain(pageUrl);
    if (!domain) return null;

    return memoryCache.get(domain) ?? null;
}

/**
 * Universal fallback getFaviconUrl for backwards compatibility.
 */
export function getFaviconUrl(pageUrl: string, size = 128): string {
    const initial = getInitialFaviconSrc(pageUrl, size);
    if (initial) return initial;

    const domain = extractDomain(pageUrl);
    if (domain) {
        return `https://faviconapi.com/${encodeURIComponent(domain)}`;
    }
    return '';
}