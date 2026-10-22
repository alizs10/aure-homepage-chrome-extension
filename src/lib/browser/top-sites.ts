import browser from 'webextension-polyfill';

export type TopSite = browser.TopSites.MostVisitedURL;

export async function getTopSites(): Promise<TopSite[]> {
    try {
        if (typeof browser !== 'undefined' && browser.topSites?.get) {
            return await browser.topSites.get();
        }
        if (typeof chrome !== 'undefined' && chrome.topSites?.get) {
            return new Promise<TopSite[]>((resolve) => {
                chrome.topSites.get((sites) => resolve(sites || []));
            });
        }
        return [];
    } catch (e) {
        console.warn('Failed to load top sites:', e);
        return [];
    }
}
