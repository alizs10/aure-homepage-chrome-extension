/**
 * Validates IPv4 addresses (e.g. 127.0.0.1, 192.168.1.1).
 * Requires exactly 4 octets between 0 and 255 with no leading zeros.
 */
export function isValidIpv4(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    for (const part of parts) {
        if (!/^\d+$/.test(part)) return false;
        const num = Number(part);
        if (num < 0 || num > 255) return false;
        if (part.length > 1 && part.startsWith('0')) return false;
    }
    return true;
}

/**
 * Validates a port string (between 1 and 65535).
 */
export function isValidPort(portStr: string): boolean {
    if (!portStr) return true;
    if (!/^\d+$/.test(portStr)) return false;
    const port = Number(portStr);
    return port >= 1 && port <= 65535;
}

/**
 * Validates whether a hostname is legitimate:
 * 1. Exactly "localhost"
 * 2. IPv6 loopback or address in brackets (e.g. [::1])
 * 3. Valid IPv4 address (e.g. 127.0.0.1, 192.168.1.10)
 * 4. Domain with at least two labels separated by dots (e.g. domain.tld, sub.domain.co.uk)
 *    where the TLD has at least 2 alpha characters.
 * Single-word typos like "loclahost" or "randomword" are strictly rejected.
 */
export function isValidHostname(hostname: string): boolean {
    if (!hostname) return false;
    const lower = hostname.toLowerCase();

    // 1. localhost is strictly permitted
    if (lower === 'localhost') return true;

    // 2. IPv6 address in bracket notation
    if (/^\[[a-fA-F0-9:]+\]$/.test(hostname)) return true;

    // 3. IPv4 address
    if (isValidIpv4(hostname)) return true;

    // 4. Must be a domain with at least two parts (e.g. domain.tld)
    const parts = lower.split('.');
    if (parts.length < 2) {
        return false;
    }

    // Check each domain label
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part || part.length > 63) return false;
        if (!/^[a-z0-9-]+$/.test(part)) return false;
        if (part.startsWith('-') || part.endsWith('-')) return false;
    }

    // TLD must have at least 2 alphabetical characters (or internationalized xn--)
    const tld = parts[parts.length - 1];
    if (!/^(xn--[a-z0-9]+|[a-z]{2,})$/.test(tld)) {
        return false;
    }

    return true;
}

/**
 * Detects if a URL has an explicit scheme (e.g. http:, https:, javascript:, mailto:).
 * Distinguishes schemes from host:port (e.g. localhost:3000).
 */
export function getUrlScheme(str: string): string | null {
    const match = str.match(/^([a-zA-Z][a-zA-Z\d+\-.]*):(\/\/|[^0-9/])/);
    return match ? match[1].toLowerCase() : null;
}

/**
 * Normalizes user-input URL to ensure it has a valid protocol.
 * - Defaults localhost and local IP addresses to http://
 * - Defaults regular domain names to https://
 * - Preserves existing protocols (e.g. http://, https://)
 */
export function normalizeUrl(rawUrl: string): string {
    const trimmed = rawUrl.trim();
    if (!trimmed) return '';

    // If it already starts with a protocol like http:// or https://
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
        return trimmed;
    }

    // Default to http:// for localhost or local loopback/private IPs
    if (
        /^localhost(:\d+)?(\/.*)?$/i.test(trimmed) ||
        /^127\.0\.0\.1(:\d+)?(\/.*)?$/.test(trimmed) ||
        /^192\.168(\.\d+){2}(:\d+)?(\/.*)?$/.test(trimmed) ||
        /^10(\.\d+){3}(:\d+)?(\/.*)?$/.test(trimmed) ||
        /^0\.0\.0\.0(:\d+)?(\/.*)?$/.test(trimmed) ||
        /^\[::1\](:\d+)?(\/.*)?$/.test(trimmed)
    ) {
        return `http://${trimmed}`;
    }

    // Default to https:// for public domains
    return `https://${trimmed}`;
}

/**
 * Validates whether an input string is a valid web address.
 * Accepts:
 * - Localhost addresses: localhost, localhost:3000, http://localhost:3000, https://localhost:443
 * - IP addresses: 127.0.0.1:8080, 192.168.1.1, 10.0.0.1:8000
 * - Standard and modern domains: github.com, https://example.com, cool.technology, etc.
 * - URLs with ports, paths, query strings, and fragments
 * Rejects:
 * - Single-word typos: loclahost, loclahost:300, randomword
 * - Empty or whitespace-only strings
 * - Disallowed protocols (javascript:, mailto:, data:, ftp:, etc.)
 * - Malformed domains, invalid ports, or strings containing unencoded spaces
 */
export function isValidWebUrl(rawUrl: string): boolean {
    if (!rawUrl || typeof rawUrl !== 'string') return false;
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return false;

    // Reject unencoded spaces in URL
    if (/\s/.test(trimmed)) return false;

    // Check scheme: only allow http and https (or no scheme)
    const scheme = getUrlScheme(trimmed);
    if (scheme && scheme !== 'http' && scheme !== 'https') {
        return false;
    }

    try {
        const urlToTest = normalizeUrl(trimmed);
        const parsed = new URL(urlToTest);

        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return false;
        }

        if (!isValidHostname(parsed.hostname)) {
            return false;
        }

        if (parsed.port && !isValidPort(parsed.port)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}
