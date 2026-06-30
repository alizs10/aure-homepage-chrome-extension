async function resolveFavicon(pageUrl: string): Promise<string> {
    try {
        const res = await fetch(pageUrl);
        const html = await res.text();

        const icon =
            html.match(/rel=["'](?:shortcut icon|icon)["'][^>]*href=["']([^"']+)["']/i)?.[1] ||
            html.match(/rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i)?.[1] ||
            "/favicon.ico";

        return new URL(icon, pageUrl).toString();
    } catch {
        const u = new URL(pageUrl);
        return `${u.origin}/favicon.ico`;
    }
}
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type !== "GET_FAVICON") return;

    resolveFavicon(msg.url).then((icon) => {
        sendResponse({ icon });
    });

    return true;
});