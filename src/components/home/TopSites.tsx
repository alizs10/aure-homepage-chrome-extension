import { useEffect, useState } from "react";
import Favicon from "../common/Favicon";
import { Typography } from "../common/Typography";
import { sliceText } from "../../helpers";

export async function getTopSites() {
    return new Promise<chrome.topSites.MostVisitedURL[]>((resolve) => {
        chrome.topSites.get((sites) => {
            console.log(sites)
            resolve(sites);
        });
    });
}

export default function TopSites() {
    const [sites, setSites] = useState<chrome.topSites.MostVisitedURL[]>([]);

    useEffect(() => {
        getTopSites().then(setSites);
    }, []);

    return (
        <div className="mt-8 flex flex-nowrap gap-x-2 mx-auto">
            {sites.map((site) => (
                <a
                    key={site.url}
                    href={site.url}
                    className="h-14 w-14 hover:w-auto hover:px-2 rounded-full border-t border-border bg-linear-to-b from-background/30 to-background app-blur flex-center group flex-row-center overflow-clip"
                >
                    <Favicon url={site.url} />

                    <div className="flex flex-col gap-y-1 w-0 opacity-0 group-hover:opacity-100 group-hover:w-44 transition-all duration-500 group-hover:pl-2">
                        <Typography className="text-nowrap" variant="caption">{sliceText(site.title, 25)}</Typography>
                        <Typography className="text-nowrap" variant="caption">{sliceText(site.url, 50)}</Typography>
                    </div>
                </a>
            ))}
        </div>
    );
}