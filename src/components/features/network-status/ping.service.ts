export const PING_CHECK_URL = "https://www.gstatic.com/generate_204";
export const PING_TIMEOUT_MS = 1500;
const PING_SAMPLE_COUNT = 3;

export const PING_FETCH_OPTIONS: RequestInit = {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
};

export interface MeasurePingOptions {
    /** Skip warm-up request when caller has just completed a health check on PING_CHECK_URL. */
    skipWarmup?: boolean;
    signal?: AbortSignal;
}

/** Builds a cache-busted URL for the 204 latency probe endpoint. */
export function buildPingUrl(): string {
    return `${PING_CHECK_URL}?t=${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

async function probeOnce(timeoutMs: number, externalSignal?: AbortSignal): Promise<number> {
    if (externalSignal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
    }

    const controller = new AbortController();
    const onExternalAbort = () => controller.abort();
    externalSignal?.addEventListener("abort", onExternalAbort, { once: true });
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const start = performance.now();
    try {
        const response = await fetch(buildPingUrl(), {
            ...PING_FETCH_OPTIONS,
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return performance.now() - start;
    } finally {
        clearTimeout(timeoutId);
        externalSignal?.removeEventListener("abort", onExternalAbort);
    }
}

/**
 * Measures warmed HTTP round-trip latency in milliseconds against PING_CHECK_URL.
 * Returns null when aborted, offline, or any probe fails/times out.
 */
export async function measurePing(options: MeasurePingOptions = {}): Promise<number | null> {
    const { skipWarmup = false, signal } = options;
    if (signal?.aborted) return null;

    try {
        if (!skipWarmup) {
            await probeOnce(PING_TIMEOUT_MS, signal);
        }

        const samples: number[] = [];
        for (let i = 0; i < PING_SAMPLE_COUNT; i++) {
            if (signal?.aborted) return null;
            const rtt = await probeOnce(PING_TIMEOUT_MS, signal);
            samples.push(rtt);
        }

        if (samples.length === 0) return null;
        return Math.max(1, Math.round(Math.min(...samples)));
    } catch {
        return null;
    }
}
