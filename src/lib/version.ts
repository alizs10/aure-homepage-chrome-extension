/**
 * Compares two semantic version strings (e.g., "0.0.5" vs "0.0.4").
 * Returns true if `latest` is strictly greater than `current`.
 */
export function isVersionHigher(latest: string, current: string): boolean {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const latestPart = latestParts[i] || 0;
        const currentPart = currentParts[i] || 0;

        if (latestPart > currentPart) return true;
        if (latestPart < currentPart) return false;
    }

    return false; // Versions are exactly equal
}