import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSettingsStore } from "@/stores";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage_keys";
import {
    fetchIpInfo,
    getCachedIpInfo,
    type IpInfo,
    IP_CACHE_DURATION_MS,
} from "./ip.service";

// CORS-enabled public endpoint for network connectivity check
const HEALTH_CHECK_URL = "https://www.gstatic.com/generate_204";

// Timeout in milliseconds for health check
const FETCH_TIMEOUT_MS = 5000;

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

    const isFetchingRef = useRef(false);

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
            setIsOnline(false);
            setIsChecking(false);
            return;
        }

        isFetchingRef.current = true;
        setIsChecking(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            const response = await fetch(`${HEALTH_CHECK_URL}?t=${Date.now()}`, {
                method: "GET",
                cache: "no-store",
                signal: controller.signal,
            });

            const online = response.ok;
            setIsOnline(online);

            if (online && enableIpChecker) {
                setIsCheckingIp(true);
                try {
                    const freshIp = await fetchIpInfo(forceIpRefresh);
                    setIpInfo(freshIp);
                } finally {
                    setIsCheckingIp(false);
                }
            }
        } catch {
            setIsOnline(false);
        } finally {
            clearTimeout(timeoutId);
            isFetchingRef.current = false;
            setIsChecking(false);
        }
    }, [enableIpChecker]);

    // Initial check & auto-refresh logic
    useEffect(() => {
        const handleOnline = () => {
            isFetchingRef.current = false;
            checkConnection(true);
        };

        const handleOffline = () => {
            isFetchingRef.current = false;
            setIsChecking(false);
            setIsOnline(false);
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_KEYS.ipData) {
                setIpInfo(getCachedIpInfo());
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        window.addEventListener("storage", handleStorage);

        // Initial connection check
        const initialCheckId = setTimeout(() => {
            checkConnection(false);
        }, 0);

        // Periodic hourly IP check
        const hourlyInterval = setInterval(() => {
            if (enableIpChecker && navigator.onLine) {
                fetchIpInfo(true).then((info) => setIpInfo(info));
            }
        }, IP_CACHE_DURATION_MS);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("storage", handleStorage);
            clearTimeout(initialCheckId);
            clearInterval(hourlyInterval);
        };
    }, [checkConnection, enableIpChecker]);

    const handleManualClick = () => {
        // Manually clicking when online forces a fresh IP check
        checkConnection(true);
    };

    const renderStatusContent = () => {
        if (isChecking) {
            return "checking...";
        }

        if (!isOnline) {
            return "offline";
        }

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
                    </span>
                );
            }

            if (isCheckingIp) {
                return "online (checking...)";
            }
        }

        return "online";
    };

    const tooltipTitle = !isOnline
        ? "Network offline - Click to check"
        : enableIpChecker && ipInfo && isFlagLoaded
            ? `${ipInfo.ip}${ipInfo.countryName ? ` • ${ipInfo.countryName}` : ""}${ipInfo.cityName ? ` (${ipInfo.cityName})` : ""} - Click to refresh`
            : "Connected - Click to check network";

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