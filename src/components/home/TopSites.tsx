import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@base-ui/react/tooltip";

import { getTopSites } from "@/lib/chrome/top-sites";
import { sliceText } from "../../helpers";
import { BetterTypography } from "../common/BetterTypography";
import Favicon from "../common/Favicon";

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
        <Tooltip.Provider>
            <div className="py-2 md:py-4 flex justify-center z-30 relative">

                {/* 🎯 FIX: Added pointer-events-none so these overlays don't block clicks/hovers on edge sites */}
                <div className="hidden max-[467px]:block absolute inset-0 right-auto bg-linear-to-r from-background to-transparent w-4 h-full z-40 pointer-events-none" />
                <div className="hidden max-[467px]:block absolute inset-0 left-auto bg-linear-to-l from-background to-transparent w-4 h-full z-40 pointer-events-none" />

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
                            <Tooltip.Root key={site.url}>
                                <Tooltip.Trigger
                                    delay={100}
                                    closeDelay={100}
                                    render={(props) => (
                                        <Link
                                            {...props}
                                            to={site.url}
                                            className={`size-10 md:size-14 min-w-10 min-h-10 md:min-w-14 md:min-h-14 rounded-full border-t border-border bg-linear-to-b from-background/30 to-background app-blur flex-center group flex-row-center z-30 transition-colors`}
                                        >
                                            <div className="transition-transform duration-200 group-hover:rotate-12">
                                                <Favicon url={site.url} />
                                            </div>
                                        </Link>
                                    )}
                                />

                                <Tooltip.Portal>
                                    <Tooltip.Positioner side="bottom" sideOffset={8}>
                                        <Tooltip.Popup
                                            className="app_container bg-background px-4 py-2 flex flex-col rounded-2xl border border-border shadow-lg z-9999
                                            data-state=closed:opacity-0 data-state=closed:scale-95
                                            data-state=open:opacity-100 data-state=open:scale-100
                                            transition-all duration-200 origin-var(--transform-origin)"
                                        >
                                            <BetterTypography className="text-nowrap" variant="12-12-16" weight="semibold">
                                                {sliceText(site.title, 25)}
                                            </BetterTypography>
                                            <BetterTypography className="text-nowrap text-muted-foreground" variant="10-10-14" as="span">
                                                {sliceText(site.url, 50)}
                                            </BetterTypography>
                                        </Tooltip.Popup>
                                    </Tooltip.Positioner>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        ))}
                </div>
            </div>
        </Tooltip.Provider>
    );
}