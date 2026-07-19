// background.ts

// Helper to convert ArrayBuffer to Base64 (Service Worker safe)
function arrayBufferToBase64(buffer: ArrayBuffer, contentType: string): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return `data:${contentType};base64,${btoa(binary)}`;
}

async function getFaviconAsBase64(domain: string): Promise<string | null> {
    // 1. Strict validation to prevent any errors
    if (!domain || typeof domain !== "string" || domain.trim() === "") {
        return null;
    }

    try {
        // 2. Strictly use the allowed Google Favicon API
        const safeDomain = encodeURIComponent(domain.trim());
        const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${safeDomain}`;

        const imgRes = await fetch(googleFaviconUrl);
        if (!imgRes.ok) return null;

        const contentType = imgRes.headers.get("content-type") || "image/png";

        // 3. Safety check: Ensure Google actually returned an image, not an HTML error page
        if (!contentType.startsWith("image/")) {
            return null;
        }

        const arrayBuffer = await imgRes.arrayBuffer();
        return arrayBufferToBase64(arrayBuffer, contentType);

    } catch (error) {
        console.warn(`Failed to fetch favicon for domain: ${domain}`, error);
        return null;
    }
}

// 4. Message listener
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    // Only respond to our specific message type AND ensure domain exists
    if (msg.type === "GET_FAVICON" && msg.domain) {
        getFaviconAsBase64(msg.domain).then((base64) => {
            sendResponse({ icon: base64 });
        });
        return true; // Keep the message channel open for async response
    }

    // Ignore all other messages
    return false;
});