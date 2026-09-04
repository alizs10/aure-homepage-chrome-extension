import { useFavorites } from "@/components/settings/components/tabs-details/sites-and-folders/components/favorites/hooks/useFavorites";
import { useFolders } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/hooks/useFolders";
import { Tooltip } from "@base-ui/react/tooltip";
import Favorites from "./favorites/Favorites";
import Folders from "./folders/Folders";

export default function FavoritesSitesAndFolders() {
    const { data: sites } = useFavorites();
    const { data: folders } = useFolders();

    if (sites.length === 0 && folders.length === 0) return null;

    return (
        <Tooltip.Provider>
            <div className="flex justify-center z-30 relative w-full max-w-6xl px-4 md:px-8 lg:px-10">

                {/* Fade gradients for small screens */}
                {/* <div className="hidden max-[467px]:block absolute inset-0 right-auto bg-linear-to-r from-background to-transparent w-4 h-full z-40 pointer-events-none" />
                <div className="hidden max-[467px]:block absolute inset-0 left-auto bg-linear-to-l from-background to-transparent w-4 h-full z-40 pointer-events-none" /> */}

                <div className="flex flex-wrap justify-center gap-1 md:gap-2 z-30">

                    <Favorites />
                    <Folders />



                </div>
            </div>
        </Tooltip.Provider>
    );
}