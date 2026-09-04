import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopSites } from "@/lib/chrome/top-sites";
import Favicon from "@/components/common/Favicon";
import { ItemTooltip } from "@/components/common/ItemTooltip";
import Button from "@/components/ui/Button";
import Skeleton from "../ui/Skeleton";

const SKELETON_COUNT = 8;

export default function TopSites() {
    const [sites, setSites] = useState<chrome.topSites.MostVisitedURL[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadTopSites() {
            try {
                const result = await getTopSites();
                if (mounted) setSites(result);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadTopSites();
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <>
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="size-10 md:size-14 min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square rounded-full"
                    />
                ))}
            </>
        );
    }

    return (
        <>
            {sites.map((site) => (
                <ItemTooltip key={site.url} title={site.title} subtitle={site.url}>
                    <Link to={site.url}>
                        <Button
                            variant="primary"
                            className="size-10 md:size-14 w-auto min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square group z-30 px-0 rounded-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="transition-transform duration-200 group-hover:rotate-12">
                                <Favicon className="min-w-4 md:min-w-8 size-4 md:size-8" url={site.url} />
                            </div>
                        </Button>
                    </Link>
                </ItemTooltip>
            ))}
        </>
    );
}