import { useEffect, useState } from "react";
import Favicon from "../common/Favicon";
import { Typography } from "../common/Typography";
import { sliceText } from "../../helpers";
import { getTopSites } from "@/lib/chrome/top-sites";



export default function TopSites() {
    const [sites, setSites] = useState<chrome.topSites.MostVisitedURL[]>([]);

    useEffect(() => {
        getTopSites().then(setSites);
    }, []);

    return (
        <div className="mt-8 flex justify-center z-30">
            <div className="flex gap-2  z-30">
                {sites.map((site) => (
                    <a
                        key={site.url}
                        href={site.url}
                        className="h-14 w-14 hover:w-auto hover:px-2 rounded-full border-t border-border bg-linear-to-b from-background/30 to-background app-blur flex-center group flex-row-center z-30"
                    >
                        <div className="group-hover:rotate-12 transition-all duration-200">
                            <Favicon url={site.url} />
                        </div>

                        {/* <div className="flex flex-col gap-y-1 w-0 opacity-0 group-hover:opacity-100 group-hover:w-44 transition-all duration-500 group-hover:pl-2">
                            <Typography className="text-nowrap" variant="caption">{sliceText(site.title, 10)}</Typography>
                            <Typography className="text-nowrap" variant="caption">{sliceText(site.url, 50)}</Typography>
                        </div> */}

                        <div className="absolute top-full left-0 mt-2 app_container bg-background px-4 py-2 group-hover:flex flex-col hidden z-30">
                            <Typography className="text-nowrap" variant="caption" weight="semibold">{sliceText(site.title, 25)}</Typography>
                            <Typography className="text-nowrap" variant="caption-xs">{sliceText(site.url, 50)}</Typography>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}