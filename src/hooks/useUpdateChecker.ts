import { useState, useEffect, useCallback } from 'react';
import { isVersionHigher } from '@/lib/version';

export interface VersionInfo {
    latestVersion: string;
    minimumSupportedVersion: string;
    releaseDate: string;
    downloadUrl: string;
    releasePage: string;
    notes: string[];
}

interface UpdateCheckState {
    lastCheckTime: number;
    appVersion: string;
    hasUpdate: boolean;
    updateInfo: VersionInfo | null;
}

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'aure_update_check_state';

export const UPDATE_CHECK_URL =
    import.meta.env.VITE_UPDATE_CHECK_URL ||
    'https://raw.githubusercontent.com/alizs10/aure-homepage-chrome-extension/main/version.json';

function getCachedState(currentVersion: string): UpdateCheckState | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        const state: UpdateCheckState = JSON.parse(stored);

        // If the stored update is no longer newer than currentVersion, or if appVersion
        // changed since last check, the cached update notification is invalid.
        const isUpdateStillValid = Boolean(
            state.updateInfo?.latestVersion && isVersionHigher(state.updateInfo.latestVersion, currentVersion)
        );

        if (state.appVersion && state.appVersion !== currentVersion) {
            // App was updated or changed since the last check; clear stale cache
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        if (state.hasUpdate && !isUpdateStillValid) {
            // Extension was updated to the latest version; clear stale "update available" flag
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        if (state.lastCheckTime && Date.now() - state.lastCheckTime < CHECK_INTERVAL_MS) {
            return {
                ...state,
                hasUpdate: isUpdateStillValid,
                updateInfo: isUpdateStillValid ? state.updateInfo : null,
            };
        }
    } catch {
        // ignore
    }
    return null;
}

export function useUpdateChecker(autoCheck: boolean = false) {
    const currentVersion = import.meta.env.VITE_APP_VERSION || '0.0.0';

    const [cached] = useState(() => getCachedState(currentVersion));
    const [loading, setLoading] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(() => {
        if (!cached?.updateInfo?.latestVersion) return null;
        return isVersionHigher(cached.updateInfo.latestVersion, currentVersion) ? cached.updateInfo : null;
    });
    const [hasUpdate, setHasUpdate] = useState<boolean>(() => {
        if (!cached?.hasUpdate || !cached?.updateInfo?.latestVersion) return false;
        return isVersionHigher(cached.updateInfo.latestVersion, currentVersion);
    });
    const [error, setError] = useState<Error | null>(null);

    // Sync across open tabs if storage changes
    useEffect(() => {
        function handleStorage(e: StorageEvent) {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    const state: UpdateCheckState = JSON.parse(e.newValue);
                    const isHigher = Boolean(
                        state.updateInfo?.latestVersion && isVersionHigher(state.updateInfo.latestVersion, currentVersion)
                    );
                    setHasUpdate(Boolean(state.hasUpdate && isHigher));
                    setUpdateInfo(isHigher ? state.updateInfo : null);
                } catch {
                    // ignore
                }
            } else if (e.key === STORAGE_KEY && !e.newValue) {
                setHasUpdate(false);
                setUpdateInfo(null);
            }
        }

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [currentVersion]);

    useEffect(() => {
        if (!autoCheck) return;

        const freshCache = getCachedState(currentVersion);
        if (freshCache) return;

        let cancelled = false;

        async function checkAutomatically() {
            try {
                const res = await fetch(UPDATE_CHECK_URL, { cache: 'no-store' });
                if (!res.ok) return;

                const latest: VersionInfo = await res.json();
                const isHigher = isVersionHigher(latest.latestVersion, currentVersion);

                const newState: UpdateCheckState = {
                    lastCheckTime: Date.now(),
                    appVersion: currentVersion,
                    hasUpdate: isHigher,
                    updateInfo: isHigher ? latest : null,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

                if (!cancelled) {
                    setHasUpdate(isHigher);
                    setUpdateInfo(isHigher ? latest : null);
                }
            } catch (e) {
                console.error('Auto update check failed:', e);
            }
        }

        checkAutomatically();

        return () => {
            cancelled = true;
        };
    }, [autoCheck, currentVersion]);

    const checkForUpdate = useCallback(async (): Promise<{ hasUpdate: boolean; updateInfo: VersionInfo | null }> => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(UPDATE_CHECK_URL, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error('Failed to fetch latest version.');
            }

            const latest: VersionInfo = await res.json();
            const isHigher = isVersionHigher(latest.latestVersion, currentVersion);

            const newState: UpdateCheckState = {
                lastCheckTime: Date.now(),
                appVersion: currentVersion,
                hasUpdate: isHigher,
                updateInfo: isHigher ? latest : null,
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

            setHasUpdate(isHigher);
            setUpdateInfo(isHigher ? latest : null);
            return { hasUpdate: isHigher, updateInfo: isHigher ? latest : null };
        } catch (err) {
            const errObj = err instanceof Error ? err : new Error(String(err));
            setError(errObj);
            throw errObj;
        } finally {
            setLoading(false);
        }
    }, [currentVersion]);

    return {
        loading,
        hasUpdate,
        updateInfo,
        error,
        currentVersion,
        checkForUpdate,
    };
}
