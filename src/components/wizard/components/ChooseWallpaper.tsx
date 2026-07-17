import { useLiveQuery } from "dexie-react-hooks";
import { ImagePlusIcon } from "lucide-react";
import { useState } from "react";

import WallpaperCard from "@/components/common/WallpaperCard";
import AddWallpaperModal from "@/components/settings/components/tabs-details/preferences-tab-details/modals/AddWallpaperModal";
import { db } from "@/lib/db";

// Import default wallpapers 
import defaultDark1 from "@/assets/background/default-dark.webp";
import defaultLight from "@/assets/background/default-light.webp";
import { BetterTypography } from "@/components/common/BetterTypography";
import type { Wallpaper } from "@/types";

// 🚨 IMPORTANT: Ensure this path matches the exact same path you use in db.ts!

// Define default wallpapers with a single "default" ID
const DEFAULT_WALLPAPERS: Wallpaper[] = [
    { id: "default", name: "Default", variants: { light: defaultLight, dark: defaultDark1 } }
];

export function ChooseWallpaper({
    value,
    onChange,
}: {
    value: string;
    onChange: (wallpaperId: string) => void;
}) {
    const [open, setOpen] = useState(false);

    // 🚀 REPLACED useEffect & useState with useLiveQuery!
    // This automatically fetches wallpapers and re-renders the grid 
    // whenever a wallpaper is added or deleted in IndexedDB.
    const customWallpapers = useLiveQuery(
        () => db.wallpapers.toArray(),
        [], // No dependencies needed, it reacts to DB changes automatically
        []  // Default value to return while the query is loading
    );

    // Combine default and custom wallpapers for rendering
    const allWallpapers = [...DEFAULT_WALLPAPERS, ...customWallpapers];

    const isWallpaperActive = (id: string) => value === id;

    // 🚀 Updated delete function using Dexie syntax
    const handleDelete = async (id: string) => {
        // Dexie syntax: directly access the table property
        await db.wallpapers.delete(id);

        // 🪄 MAGIC: No need to manually call setCustomWallpapers() here!
        // useLiveQuery detects the deletion and automatically removes it from the UI.
    };

    // 🚀 Updated handler for when a new wallpaper is added
    const handleWallpaperAdded = (newId: string) => {
        // 🪄 MAGIC: No need to manually call fetchCustomWallpapers() here!
        // useLiveQuery detects the new addition and automatically adds it to the grid.

        // Automatically set the new wallpaper as active
        onChange(newId);
    };

    return (
        <>
            <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:sm:grid-cols-2 lg:sm:grid-cols-3 gap-1 sm:gap-2">
                    {allWallpapers.map((wp) => (
                        <WallpaperCard
                            key={wp.id}
                            lightVariant={wp.variants.light}
                            darkVariant={wp.variants.dark}
                            name={wp.name}
                            isActive={isWallpaperActive(wp.id)}
                            onSelect={() => onChange(wp.id)}
                            deletable={wp.id !== 'default'}
                            onDelete={() => handleDelete(wp.id)}
                        />
                    ))}

                    <div
                        onClick={() => setOpen(true)}
                        className="aspect-video rounded-3xl bg-secondary/50 border-2 border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-y-4 cursor-pointer overflow-hidden relative"
                    >
                        <ImagePlusIcon className="size-6 xl:size-10 text-muted-foreground" />
                        <BetterTypography className="text-nowrap" variant="14-12-10-12-14" weight="medium">
                            Add Your Own Wallpaper
                        </BetterTypography>
                    </div>
                </div>
            </div>

            {open && (
                <AddWallpaperModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onWallpaperChange={handleWallpaperAdded}
                />
            )}
        </>
    );
}