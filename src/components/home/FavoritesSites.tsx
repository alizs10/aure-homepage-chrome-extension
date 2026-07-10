import { useEffect, useState } from "react";
import Favicon from "../common/Favicon";
import { Typography } from "../common/Typography";
import { sliceText } from "../../helpers";
import { Link } from "react-router-dom";
import { FavoritesRepository } from "../settings/components/tabs-details/sites-and-shortcuts/db";
import type { Favorite } from "../settings/components/tabs-details/sites-and-shortcuts/types";



export default function FavoritesSites() {

    const [sites, setSites] = useState<Favorite[]>([]);

    useEffect(() => {
        async function load() {
            const favorites = await FavoritesRepository.getAll();
            const sorted = favorites.sort((a, b) => a.order - b.order)
            setSites(sorted);
        }

        load();
    }, []);
    return (
        <div className="py-2 md:py-4 flex justify-center z-30 relative">

            <div className="hidden max-[467px]:block absolute inset-0 right-auto bg-linear-to-r from-background to-transparent w-4 h-full z-40" />
            <div className="hidden max-[467px]:block absolute inset-0 left-auto bg-linear-to-l from-background to-transparent w-4 h-full z-40" />

            <div className="flex gap-1 md:gap-2 z-30 pl-4 pr-4 w-fit max-w-full max-[467px]:overflow-x-scroll scrollbar-none">
                {sites.map((site) => (
                    <Link
                        key={site.url}
                        to={site.url}
                        id={`top-site-${site.url}`}
                        className="size-10 md:size-14 min-w-10 md:min-w-14 rounded-full border-t border-border bg-linear-to-b from-background/30 to-background app-blur flex-center group flex-row-center z-30"
                    >
                        <div className="group-hover:rotate-12 transition-all duration-200">
                            <Favicon url={site.url} />
                        </div>

                        <div role="tooltip" id={`tooltip-${site.url}`} className="absolute top-full left-0 mt-2 app_container bg-background px-4 py-2 group-hover:flex flex-col hidden z-30">
                            <Typography className="text-nowrap" variant="caption" weight="semibold">{sliceText(site.title, 25)}</Typography>
                            <Typography className="text-nowrap" variant="caption-xs">{sliceText(site.url, 50)}</Typography>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}