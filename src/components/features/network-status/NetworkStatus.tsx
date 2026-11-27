import { BetterTypography } from "@/components/common/BetterTypography";
import Badge, { type BadgeProps } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSettingsStore } from "@/stores";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage_keys";
import {
    fetchIpInfo,
    getCachedIpInfo,
    isIpCacheValid,
    type IpInfo,
    IP_AUTO_REFRESH_INTERVAL_MS,
} from "./ip.service";
import {
    buildPingUrl,
    measurePing,
    PING_FETCH_OPTIONS,
} from "./ping.service";

// Timeout in milliseconds for initial connectivity check
const FETCH_TIMEOUT_MS = 5000;

// Delay initial mount check slightly so New Tab hydration/rendering settles before timing ping
const INITIAL_CHECK_DELAY_MS = 150;

function getPingBadgeVariant(pingMs: number): BadgeProps["variant"] {
    if (pingMs < 100) return "success";
    if (pingMs <= 250) return "warning";
    return "destructive";
}

function isFlagImageCached(countryCode?: string): boolean {
    if (!countryCode || typeof Image === "undefined") return false;
    const img = new Image();
    img.src = `https://flagcdn.com/20x15/${countryCode.toLowerCase()}.png`;
    return img.complete && img.naturalWidth > 0;
}

export default function NetworkStatus() {
    const { settings } = useSettingsStore();
    const enableIpChecker = settings?.enable_ip_checker ?? false;

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isChecking, setIsChecking] = useState(false);
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(() => getCachedIpInfo());
    const [isCheckingIp, setIsCheckingIp] = useState(false);
    const [isFlagLoaded, setIsFlagLoaded] = useState(() => isFlagImageCached(ipInfo?.countryCode));
    const [pingMs, setPingMs] = useState<number | null>(null);

    const isFetchingRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Preload & verify flag image before showing IP address
    useEffect(() => {
        let isMounted = true;

        if (!enableIpChecker || !ipInfo?.countryCode) {
            queueMicrotask(() => {
                if (isMounted) setIsFlagLoaded(false);
            });
            return;
        }

        const flagUrl = `https://flagcdn.com/20x15/${ipInfo.countryCode.toLowerCase()}.png`;
        const img = new Image();
        img.src = flagUrl;

        if (img.complete && img.naturalWidth > 0) {
            queueMicrotask(() => {
                if (isMounted) setIsFlagLoaded(true);
            });
            return;
        }

        img.onload = () => {
            if (isMounted) {
                setIsFlagLoaded(true);
            }
        };

        img.onerror = () => {
            if (isMounted) {
                setIsFlagLoaded(false);
            }
        };

        return () => {
            isMounted = false;
        };
    }, [enableIpChecker, ipInfo?.countryCode]);

    const checkConnection = useCallback(async (forceIpRefresh = false) => {
        if (isFetchingRef.current) return;

        if (!navigator.onLine) {
            abortControllerRef.current?.abort();
            setIsOnline(false);
            setPingMs(null);
            setIsChecking(false);
            return;
        }

        abortControllerRef.current?.abort();
        const runController = new AbortController();
        abortControllerRef.current = runController;

        isFetchingRef.current = true;
        setIsChecking(true);

        const healthController = new AbortController();
        const onRunAbort = () => healthController.abort();
        runController.signal.addEventListener("abort", onRunAbort, { once: true });
        const timeoutId = setTimeout(() => healthController.abort(), FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(buildPingUrl(), {
                ...PING_FETCH_OPTIONS,
                signal: healthController.signal,
            });
            clearTimeout(timeoutId);
            runController.signal.removeEventListener("abort", onRunAbort);

            if (runController.signal.aborted) return;

            const online = response.ok;
            setIsOnline(online);

            if (!online) {
                setPingMs(null);
                return;
            }

            // Measure warmed HTTP RTT before GeoIP requests so latency isn't skewed by concurrent bandwidth/CPU load
            const measuredPing = await measurePing({
                skipWarmup: true,
                signal: runController.signal,
            });
            if (runController.signal.aborted) return;
            setPingMs(measuredPing);

            if (enableIpChecker) {
                const cached = getCachedIpInfo();
                const needsFetch = forceIpRefresh || !isIpCacheValid(cached);

                if (needsFetch) {
                    setIsCheckingIp(true);
                    try {
                        const freshIp = await fetchIpInfo(forceIpRefresh);
                        if (!runController.signal.aborted) {
                            setIpInfo(freshIp);
                        }
                    } finally {
                        setIsCheckingIp(false);
                    }
                } else if (cached) {
                    setIpInfo(cached);
                }
            }
        } catch {
            if (!runController.signal.aborted) {
                setIsOnline(false);
                setPingMs(null);
            }
        } finally {
            clearTimeout(timeoutId);
            runController.signal.removeEventListener("abort", onRunAbort);
            if (abortControllerRef.current === runController) {
                abortControllerRef.current = null;
            }
            isFetchingRef.current = false;
            setIsChecking(false);
        }
    }, [enableIpChecker]);

    // Initial check & auto-refresh logic
    useEffect(() => {
        const handleOnline = () => {
            abortControllerRef.current?.abort();
            isFetchingRef.current = false;
            checkConnection(true);
        };

        const handleOffline = () => {
            abortControllerRef.current?.abort();
            isFetchingRef.current = false;
            setIsChecking(false);
            setIsOnline(false);
            setPingMs(null);
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_KEYS.ipData) {
                setIpInfo(getCachedIpInfo());
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        window.addEventListener("storage", handleStorage);

        // Initial connection check (deferred briefly so startup hydration doesn't skew ping timing)
        const initialCheckId = setTimeout(() => {
            checkConnection(false);
        }, INITIAL_CHECK_DELAY_MS);

        // Periodic background IP auto-check every 5 minutes
        const autoRefreshInterval = setInterval(() => {
            if (enableIpChecker && navigator.onLine) {
                fetchIpInfo(true).then((info) => setIpInfo(info));
            }
        }, IP_AUTO_REFRESH_INTERVAL_MS);

        return () => {
            abortControllerRef.current?.abort();
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("storage", handleStorage);
            clearTimeout(initialCheckId);
            clearInterval(autoRefreshInterval);
        };
    }, [checkConnection, enableIpChecker]);

    const handleManualClick = () => {
        // Manually clicking when online checks connection, measures ping, and refreshes IP if cache is older than 30s
        checkConnection(false);
    };

    const renderPingBadge = (value: number) => (
        <Badge
            variant={getPingBadgeVariant(value)}
            size="xs"
            className="ml-1.5 tabular-nums"
        >
            {value}ms
        </Badge>
    );

    const renderStatusContent = () => {
        if (isChecking) {
            return "checking...";
        }

        if (!isOnline) {
            return "offline";
        }

        const pingBadge = pingMs !== null ? renderPingBadge(pingMs) : null;

        if (enableIpChecker) {
            // Only show IP address once the flag image is verified loaded
            if (ipInfo?.ip && ipInfo.countryCode && isFlagLoaded) {
                return (
                    <span className="flex-row-center inline-flex">
                        online&nbsp;(
                        <img
                            src={`https://flagcdn.com/20x15/${ipInfo.countryCode.toLowerCase()}.png`}
                            alt={ipInfo.countryCode}
                            width={16}
                            height={12}
                            className="inline-block mx-1 w-3.5 h-2.5 rounded-[2px] object-cover align-baseline shrink-0"
                            onError={() => {
                                setIsFlagLoaded(false);
                            }}
                        />
                        {ipInfo.ip})
                        {pingBadge}
                    </span>
                );
            }

            if (isCheckingIp) {
                return (
                    <span className="flex-row-center inline-flex">
                        online (checking...)
                        {pingBadge}
                    </span>
                );
            }
        }

        if (pingBadge) {
            return (
                <span className="flex-row-center inline-flex">
                    online
                    {pingBadge}
                </span>
            );
        }

        return "online";
    };

    const pingTooltipSuffix = pingMs !== null ? `${pingMs}ms ping` : "";
    const tooltipTitle = !isOnline
        ? "Network offline - Click to check"
        : enableIpChecker && ipInfo && isFlagLoaded
            ? `${ipInfo.ip}${ipInfo.countryName ? ` • ${ipInfo.countryName}` : ""}${ipInfo.cityName ? ` (${ipInfo.cityName})` : ""}${pingTooltipSuffix ? ` • ${pingTooltipSuffix}` : ""} - Click to refresh`
            : `Connected${pingTooltipSuffix ? ` (${pingTooltipSuffix})` : ""} - Click to check network`;

    return (
        <Button
            variant="ghost"
            size="xs"
            className="gap-x-1"
            onClick={handleManualClick}
            disabled={isChecking}
            title={tooltipTitle}
            leftIcon={
                <div
                    className={`size-1.5 rounded-full transition-colors duration-300 ${isChecking
                        ? "bg-gray-400 animate-pulse"
                        : isOnline
                            ? "bg-success"
                            : "bg-destructive"
                        }`}
                />
            }
        >
            <BetterTypography variant="12" weight="medium" as="span">
                {renderStatusContent()}
            </BetterTypography>
        </Button>
    );
}