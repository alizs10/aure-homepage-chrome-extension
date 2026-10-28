import browser from 'webextension-polyfill';
import { useState, useEffect, useCallback } from 'react';

export interface HostPermissionItem {
    id: string;
    service: string;
    origins: string[];
    displayHost: string;
    description: string;
}

export interface PermissionOpResult {
    success: boolean;
    error?: string;
}

export const HOST_PERMISSION_ITEMS: HostPermissionItem[] = [
    {
        id: "google-suggestions",
        service: "Google Search Suggestions",
        origins: ["https://suggestqueries.google.com/*"],
        displayHost: "https://suggestqueries.google.com/*",
        description: "Provides live autocomplete suggestions in the main search bar as you type.",
    },
    {
        id: "ip-checker",
        service: "GeoJS & ipwho.is",
        origins: [
            "https://*.geojs.io/*",
            "https://ipwho.is/*",
        ],
        displayHost: "https://*.geojs.io/* & https://ipwho.is/*",
        description: "Fetches your public IP address and country info only when the IP Checker setting is enabled.",
    },
    {
        id: "flag-cdn",
        service: "Flag CDN",
        origins: ["https://flagcdn.com/*"],
        displayHost: "https://flagcdn.com/*",
        description: "Provides country flag images matching your detected IP address location.",
    },
    {
        id: "connectivity",
        service: "Google Connectivity Check",
        origins: ["https://*.gstatic.com/*"],
        displayHost: "https://*.gstatic.com/*",
        description: "Pings Google's lightweight generate_204 endpoint to accurately detect online/offline network status.",
    },
    {
        id: "updates",
        service: "GitHub Repository",
        origins: ["https://raw.githubusercontent.com/*"],
        displayHost: "https://raw.githubusercontent.com/*",
        description: "Checks for extension version updates and loads release notes.",
    },
    {
        id: "favicon-api",
        service: "Website Favicons",
        origins: ["https://faviconapi.com/*"],
        displayHost: "https://faviconapi.com/*",
        description: "Fetches domain favicons for bookmarks and top sites in Firefox.",
    },
];

/**
 * Gets all declared host permissions from the current manifest (both optional and required).
 */
export function getManifestHostPermissions(): string[] {
    try {
        const manifest =
            typeof browser !== 'undefined' && browser.runtime?.getManifest
                ? browser.runtime.getManifest()
                : typeof chrome !== 'undefined' && chrome.runtime?.getManifest
                  ? chrome.runtime.getManifest()
                  : null;

        if (manifest) {
            const m = manifest as {
                host_permissions?: string[];
                optional_host_permissions?: string[];
                optional_permissions?: string[];
            };
            const combined = [
                ...(m.optional_host_permissions || []),
                ...(m.host_permissions || []),
            ];
            return Array.from(new Set(combined));
        }
    } catch {
        // Fallback
    }
    return [];
}

/**
 * Returns host permission items applicable to the current browser platform.
 */
export function getApplicableHostPermissionItems(): HostPermissionItem[] {
    const available = getManifestHostPermissions();
    if (available.length === 0) return HOST_PERMISSION_ITEMS;
    return HOST_PERMISSION_ITEMS.filter((item) =>
        item.origins.some((o) => available.includes(o))
    );
}

/**
 * Checks if the given origins are already granted.
 */
export async function checkHostPermissions(origins: string[]): Promise<boolean> {
    try {
        const available = getManifestHostPermissions();
        const validOrigins = available.length > 0 
            ? origins.filter(o => available.includes(o))
            : origins;

        if (validOrigins.length === 0) return true;

        if (typeof browser !== 'undefined' && browser.permissions?.contains) {
            return await browser.permissions.contains({ origins: validOrigins });
        }
        if (typeof chrome !== 'undefined' && chrome.permissions?.contains) {
            return new Promise<boolean>((resolve) => {
                chrome.permissions.contains({ origins: validOrigins }, (has) => {
                    resolve(Boolean(has));
                });
            });
        }
        return true;
    } catch (err) {
        console.warn("Failed to check host permissions:", err);
        return false;
    }
}

/**
 * Checks if all manifest host permissions have been granted.
 */
export async function checkAllHostPermissions(): Promise<boolean> {
    const available = getManifestHostPermissions();
    if (available.length === 0) return true;
    return checkHostPermissions(available);
}

/**
 * Requests host permissions from the user via the native browser prompt.
 * MUST be invoked directly in response to a user action (click/key event).
 */
export async function requestHostPermissions(origins?: string[]): Promise<boolean> {
    try {
        const available = getManifestHostPermissions();
        const toRequest = (origins && origins.length > 0 ? origins : available)
            .filter((o) => available.length === 0 || available.includes(o));

        if (toRequest.length === 0) return true;

        if (typeof browser !== 'undefined' && browser.permissions?.request) {
            return await browser.permissions.request({ origins: toRequest });
        }
        if (typeof chrome !== 'undefined' && chrome.permissions?.request) {
            return new Promise<boolean>((resolve) => {
                chrome.permissions.request({ origins: toRequest }, (granted) => {
                    if (chrome.runtime.lastError) {
                        console.warn("Failed to request permissions:", chrome.runtime.lastError.message);
                        resolve(false);
                        return;
                    }
                    resolve(Boolean(granted));
                });
            });
        }
        return true;
    } catch (err) {
        console.warn("Failed to request host permissions:", err);
        return false;
    }
}

/**
 * Revokes/removes host permissions.
 */
export async function removeHostPermissions(origins?: string[]): Promise<PermissionOpResult> {
    try {
        const available = getManifestHostPermissions();
        const toRemove = (origins && origins.length > 0 ? origins : available)
            .filter((o) => available.length === 0 || available.includes(o));

        if (toRemove.length === 0) return { success: true };

        if (typeof browser !== 'undefined' && browser.permissions?.remove) {
            const removed = await browser.permissions.remove({ origins: toRemove });
            return { success: Boolean(removed) };
        }
        if (typeof chrome !== 'undefined' && chrome.permissions?.remove) {
            return new Promise<PermissionOpResult>((resolve) => {
                chrome.permissions.remove({ origins: toRemove }, (removed) => {
                    if (chrome.runtime.lastError) {
                        const msg = chrome.runtime.lastError.message || '';
                        resolve({ success: false, error: msg });
                        return;
                    }
                    resolve({ success: Boolean(removed) });
                });
            });
        }
        return { success: true };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { success: false, error: msg };
    }
}

/**
 * Subscribes to runtime permission additions and removals.
 */
export function subscribePermissionsChange(callback: () => void): () => void {
    const api =
        typeof browser !== 'undefined' && browser.permissions
            ? browser.permissions
            : typeof chrome !== 'undefined' && chrome.permissions
              ? chrome.permissions
              : null;

    if (!api) return () => {};

    const listener = () => callback();

    api.onAdded?.addListener?.(listener);
    api.onRemoved?.addListener?.(listener);

    return () => {
        api.onAdded?.removeListener?.(listener);
        api.onRemoved?.removeListener?.(listener);
    };
}

/**
 * React hook to observe, grant, and revoke host permissions.
 */
export function useHostPermissions() {
    const [allGranted, setAllGranted] = useState<boolean>(true);
    const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const updateStatus = useCallback(async () => {
        const available = getManifestHostPermissions();
        if (available.length === 0) {
            setAllGranted(true);
            setIsLoading(false);
            return;
        }

        const isAll = await checkHostPermissions(available);
        const newMap: Record<string, boolean> = {};
        for (const item of HOST_PERMISSION_ITEMS) {
            const applicableOrigins = item.origins.filter(o => available.includes(o));
            if (applicableOrigins.length === 0) {
                newMap[item.id] = true;
            } else {
                newMap[item.id] = await checkHostPermissions(applicableOrigins);
            }
        }

        setAllGranted(isAll);
        setStatusMap(newMap);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const check = async () => {
            const available = getManifestHostPermissions();
            if (available.length === 0) {
                if (isMounted) {
                    setAllGranted(true);
                    setIsLoading(false);
                }
                return;
            }

            const isAll = await checkHostPermissions(available);
            const newMap: Record<string, boolean> = {};
            for (const item of HOST_PERMISSION_ITEMS) {
                const applicableOrigins = item.origins.filter(o => available.includes(o));
                if (applicableOrigins.length === 0) {
                    newMap[item.id] = true;
                } else {
                    newMap[item.id] = await checkHostPermissions(applicableOrigins);
                }
            }

            if (isMounted) {
                setAllGranted(isAll);
                setStatusMap(newMap);
                setIsLoading(false);
            }
        };

        void check();
        const unsubscribe = subscribePermissionsChange(() => {
            void check();
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const requestAll = useCallback(async () => {
        const available = getManifestHostPermissions();
        const granted = await requestHostPermissions(available);
        if (granted) {
            await updateStatus();
        }
        return granted;
    }, [updateStatus]);

    const requestItem = useCallback(async (item: HostPermissionItem) => {
        const available = getManifestHostPermissions();
        const applicableOrigins = item.origins.filter(o => available.includes(o));
        const granted = await requestHostPermissions(applicableOrigins);
        if (granted) {
            await updateStatus();
        }
        return granted;
    }, [updateStatus]);

    const revokeAll = useCallback(async () => {
        const available = getManifestHostPermissions();
        const result = await removeHostPermissions(available);
        if (result.success) {
            await updateStatus();
        }
        return result;
    }, [updateStatus]);

    const revokeItem = useCallback(async (item: HostPermissionItem) => {
        const available = getManifestHostPermissions();
        const applicableOrigins = item.origins.filter(o => available.includes(o));
        const result = await removeHostPermissions(applicableOrigins);
        if (result.success) {
            await updateStatus();
        }
        return result;
    }, [updateStatus]);

    const applicableItems = getApplicableHostPermissionItems();

    return {
        allGranted,
        statusMap,
        isLoading,
        applicableItems,
        refresh: updateStatus,
        requestAll,
        requestItem,
        revokeAll,
        revokeItem,
    };
}
