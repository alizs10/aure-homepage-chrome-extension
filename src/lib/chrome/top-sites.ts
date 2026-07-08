export async function getTopSites() {
    return new Promise<chrome.topSites.MostVisitedURL[]>((resolve) => {
        chrome.topSites.get((sites) => {
            resolve(sites);
        });
    });
}