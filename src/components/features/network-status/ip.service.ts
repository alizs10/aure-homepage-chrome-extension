import { LOCAL_STORAGE_KEYS } from "@/constants/storage_keys";

export interface IpInfo {
    ip: string;
    countryCode: string;
    countryName: string;
    cityName?: string;
    timestamp: number;
}

export const IP_CACHE_DURATION_MS = 30 * 1000; // 30 secs
const PRIMARY_IP_API_URL = "https://free.freeipapi.com/api/v1/json";
const FALLBACK_IP_API_URL = "https://freeipapi.com/api/json";
const FETCH_TIMEOUT_MS = 6000;

// Deduplicate concurrent in-flight requests
let inFlightRequest: Promise<IpInfo | null> | null = null;

export function getCachedIpInfo(): IpInfo | null {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ipData);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as IpInfo;
        if (parsed && typeof parsed.ip === "string" && parsed.ip.length > 0) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

export function isIpCacheValid(info: IpInfo | null): boolean {
    if (!info || !info.timestamp || !info.ip) return false;
    return Date.now() - info.timestamp < IP_CACHE_DURATION_MS;
}

export function saveCachedIpInfo(info: IpInfo): void {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ipData, JSON.stringify(info));
    } catch {
        // Ignore quota/private browsing write errors
    }
}

export function clearCachedIpInfo(): void {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ipData);
    } catch {
        // Ignore errors
    }
}

export async function fetchIpInfo(force = false): Promise<IpInfo | null> {
    if (!force) {
        const cached = getCachedIpInfo();
        if (isIpCacheValid(cached)) {
            return cached;
        }
    }

    if (inFlightRequest) {
        return inFlightRequest;
    }

    inFlightRequest = (async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            let response: Response;
            try {
                response = await fetch(PRIMARY_IP_API_URL, {
                    method: "GET",
                    signal: controller.signal,
                    cache: "no-store",
                });
            } catch {
                response = await fetch(FALLBACK_IP_API_URL, {
                    method: "GET",
                    signal: controller.signal,
                    cache: "no-store",
                });
            }

            if (!response.ok) {
                return getCachedIpInfo();
            }

            const data = await response.json();
            const ip = data.ipAddress || data.ip;
            const countryCode = (data.countryCode || "").toUpperCase();
            const countryName = data.countryName || "";
            const cityName = data.cityName || "";

            if (!ip) {
                return getCachedIpInfo();
            }

            const ipInfo: IpInfo = {
                ip,
                countryCode,
                countryName,
                cityName,
                timestamp: Date.now(),
            };

            saveCachedIpInfo(ipInfo);
            return ipInfo;
        } catch {
            return getCachedIpInfo();
        } finally {
            clearTimeout(timeoutId);
            inFlightRequest = null;
        }
    })();

    return inFlightRequest;
}
