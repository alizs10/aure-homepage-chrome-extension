import browser from 'webextension-polyfill';
import type { Website } from '../types';

/**
 * Opens up to 5 websites simultaneously in new tabs.
 * The first tab is opened in the foreground (active: true) so the user is taken directly
 * to their routine, while the remaining tabs load smoothly in background tabs (active: false).
 */
export async function launchRoutine(websites: Website[]): Promise<void> {
    if (!websites || websites.length === 0) return;

    for (let i = 0; i < websites.length; i++) {
        const site = websites[i];
        try {
            if (typeof browser !== 'undefined' && browser.tabs?.create) {
                await browser.tabs.create({
                    url: site.url,
                    active: i === 0,
                });
            } else {
                window.open(site.url, '_blank', 'noopener,noreferrer');
            }
        } catch {
            window.open(site.url, '_blank', 'noopener,noreferrer');
        }
    }
}
