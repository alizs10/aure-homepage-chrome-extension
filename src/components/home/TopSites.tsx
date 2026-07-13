import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Favicon from "../common/Favicon";
import { Typography } from "../common/Typography";
import { sliceText } from "../../helpers";
import { getTopSites } from "@/lib/chrome/top-sites";

const SKELETON_COUNT = 8;

export default function TopSites() {
    const [sites, setSites] = useState<chrome.topSites.MostVisitedURL[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadTopSites() {
            try {
                const result = await getTopSites();

                if (mounted) {
                    setSites(result);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadTopSites();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="py-2 md:py-4 flex justify-center z-30 relative">
            <div className="hidden max-[467px]:block absolute inset-0 right-auto bg-linear-to-r from-background to-transparent w-4 h-full z-40" />
            <div className="hidden max-[467px]:block absolute inset-0 left-auto bg-linear-to-l from-background to-transparent w-4 h-full z-40" />

            <div className="flex gap-1 md:gap-2 z-30 pl-4 pr-4 w-fit max-w-full max-[467px]:overflow-x-scroll scrollbar-none">
                {loading
                    ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="size-10 md:size-14 min-w-10 md:min-w-14 rounded-full border-t border-border bg-linear-to-b from-background/30 to-background app-blur flex-center animate-pulse"
                        >
                            <div className="min-w-6 md:min-w-10 size-6 md:size-10 rounded-full bg-muted" />
                        </div>
                    ))
                    : sites.map((site) => (
                        <Link
                            key={site.url}
                            to={site.url}
                            id={`top-site-${site.url}`}
                            className="size-10 md:size-14 min-w-10 md:min-w-14 rounded-full border-t border-border bg-linear-to-b from-background/30 to-background app-blur flex-center group flex-row-center z-30"
                        >
                            <div className="group-hover:rotate-12 transition-all duration-200">
                                <Favicon url={site.url} />
                            </div>

                            <div
                                role="tooltip"
                                id={`tooltip-${site.url}`}
                                className="absolute top-full left-0 mt-2 app_container bg-background px-4 py-2 group-hover:flex flex-col hidden z-30"
                            >
                                <Typography className="text-nowrap" variant="caption" weight="semibold">
                                    {sliceText(site.title, 25)}
                                </Typography>

                                <Typography className="text-nowrap" variant="caption-xs">
                                    {sliceText(site.url, 50)}
                                </Typography>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
}