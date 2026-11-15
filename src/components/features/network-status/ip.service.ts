import { LOCAL_STORAGE_KEYS } from "@/constants/storage_keys";

export interface IpInfo {
    ip: string;
    countryCode: string;
    countryName: string;
    cityName?: string;
    timestamp: number;
}

export const IP_CACHE_DURATION_MS = 30 * 1000; // 30 secs
export const IP_AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 mins
const IP_API_ENDPOINTS = [
    "https://ipv4.geojs.io/v1/ip/geo.json",
    "https://get.geojs.io/v1/ip/geo.json",
    "https://ipwho.is/",
];
const FETCH_TIMEOUT_MS = 5000;

// Deduplicate concurrent in-flight requests
let inFlightRequest: Promise<IpInfo | null> | null = null;

interface RawIpResponse {
    ip?: string;
    ipAddress?: string;
    country?: string;
    countryName?: string;
    country_code?: string;
    countryCode?: string;
    city?: string;
    cityName?: string;
    success?: boolean;
}

function parseIpResponse(data: unknown): IpInfo | null {
    if (!data || typeof data !== "object") return null;

    const raw = data as RawIpResponse;
    if (raw.success === false) return null;

    const ip = raw.ip || raw.ipAddress;
    if (!ip || typeof ip !== "string") return null;

    const countryCode = (raw.country_code || raw.countryCode || "").toUpperCase();
    const countryName = raw.country || raw.countryName || "";
    const cityName = raw.city || raw.cityName || "";

    return {
        ip: ip.trim(),
        countryCode: countryCode.trim(),
        countryName: countryName.trim(),
        cityName: cityName.trim(),
        timestamp: Date.now(),
    };
}

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

async function fetchEndpoint(url: string, timeoutMs: number): Promise<unknown> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    } finally {
        clearTimeout(timeoutId);
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
        try {
            let ipInfo: IpInfo | null = null;

            for (const endpoint of IP_API_ENDPOINTS) {
                try {
                    const data = await fetchEndpoint(endpoint, FETCH_TIMEOUT_MS);
                    const parsed = parseIpResponse(data);
                    if (parsed) {
                        ipInfo = parsed;
                        break;
                    }
                } catch {
                    // Try next endpoint on network or HTTP error
                }
            }

            if (!ipInfo) {
                return getCachedIpInfo();
            }

            saveCachedIpInfo(ipInfo);
            return ipInfo;
        } catch {
            return getCachedIpInfo();
        } finally {
            inFlightRequest = null;
        }
    })();

    return inFlightRequest;
}
