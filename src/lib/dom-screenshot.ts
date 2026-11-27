import { domToPng } from 'modern-screenshot';
import browser from 'webextension-polyfill';

/**
 * Crops a full-page screenshot data URL to the bounding box of a specific element.
 */
async function cropScreenshotToElement(dataUrl: string, element: HTMLElement): Promise<string> {
    const rect = element.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const canvas = document.createElement('canvas');
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context');

    ctx.drawImage(
        img,
        Math.round(rect.left * dpr),
        Math.round(rect.top * dpr),
        width,
        height,
        0,
        0,
        width,
        height
    );

    return canvas.toDataURL('image/png');
}

/**
 * Captures an HTML element to a PNG image data URL.
 * 
 * 1. Attempts native tab capture (`captureVisibleTab`) which provides 100% pixel-perfect
 *    GPU glassmorphism and compositor rendering when allowed by the browser.
 * 2. If the browser restricts tab capture (e.g. Firefox restricting in-page clicks on moz-extension://),
 *    it automatically falls back to `modern-screenshot` (domToPng) to guarantee a reliable screenshot.
 */
export async function captureElementToPng(element: HTMLElement): Promise<string> {
    // 1. Try native browser tab capture
    try {
        if (typeof browser !== 'undefined' && browser.tabs?.captureVisibleTab) {
            // Note: in Firefox, the first parameter must be null (or windowId integer), not omitted/undefined
            const captureVisibleTab = browser.tabs.captureVisibleTab as unknown as (
                windowId: number | null,
                options: { format: 'png' }
            ) => Promise<string>;
            const dataUrl = await captureVisibleTab(null, { format: 'png' });
            if (dataUrl) {
                return await cropScreenshotToElement(dataUrl, element);
            }
        }
    } catch (e) {
        console.warn('Direct captureVisibleTab failed, trying background message...', e);
    }

    // 1b. Try through background script if direct call was blocked
    try {
        if (typeof browser !== 'undefined' && browser.runtime?.sendMessage) {
            const res = (await browser.runtime.sendMessage({ action: 'CAPTURE_VISIBLE_TAB' })) as
                | { success?: boolean; dataUrl?: string }
                | undefined;
            if (res?.success && res.dataUrl) {
                return await cropScreenshotToElement(res.dataUrl, element);
            }
        }
    } catch {
        // Background message failed or rejected; fallback to modern-screenshot below
    }

    // 2. Reliable DOM-to-PNG fallback via modern-screenshot
    const isDark =
        element.classList.contains('dark') ||
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark');

    return await domToPng(element, {
        scale: 2,
        quality: 1,
        backgroundColor: isDark ? '#09090b' : '#ffffff',
        features: {
            removeControlCharacter: true,
        },
    });
}
