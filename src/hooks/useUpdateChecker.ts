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
    hasUpdate: boolean;
    updateInfo: VersionInfo | null;
}

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'aure_update_check_state';

export const UPDATE_CHECK_URL =
    import.meta.env.VITE_UPDATE_CHECK_URL ||
    'https://raw.githubusercontent.com/alizs10/aure-homepage-chrome-extension/main/version.json';

function getCachedState(): UpdateCheckState | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        const state: UpdateCheckState = JSON.parse(stored);
        if (state.lastCheckTime && Date.now() - state.lastCheckTime < CHECK_INTERVAL_MS) {
            return state;
        }
    } catch {
        // ignore
    }
    return null;
}

export function useUpdateChecker(autoCheck: boolean = false) {
    const [cached] = useState(getCachedState);
    const [loading, setLoading] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(cached?.updateInfo ?? null);
    const [hasUpdate, setHasUpdate] = useState<boolean>(cached?.hasUpdate ?? false);
    const [error, setError] = useState<Error | null>(null);

    const currentVersion = import.meta.env.VITE_APP_VERSION || '0.0.0';

    useEffect(() => {
        if (!autoCheck) return;

        const freshCache = getCachedState();
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
