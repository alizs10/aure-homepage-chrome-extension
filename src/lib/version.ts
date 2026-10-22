/**
 * Compares two semantic version strings (e.g., "0.0.5" vs "0.0.4").
 * Returns 1 if a > b, -1 if a < b, and 0 if a === b.
 */
export function compareVersions(a: string, b: string): number {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const da = pa[i] ?? 0;
        const db = pb[i] ?? 0;
        if (da > db) return 1;
        if (da < db) return -1;
    }
    return 0;
}

/**
 * Returns true if `latest` is strictly greater than `current`.
 */
export function isVersionHigher(latest: string, current: string): boolean {
    return compareVersions(latest, current) > 0;
}