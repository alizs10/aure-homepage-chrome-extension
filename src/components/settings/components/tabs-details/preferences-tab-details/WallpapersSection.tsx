import { useLiveQuery } from "dexie-react-hooks";
import { ImagePlusIcon } from "lucide-react";
import { useState } from "react";

import WallpaperCard from "@/components/common/WallpaperCard";
import Button from "@/components/ui/Button";
import { db } from "@/lib/db";
import { useSettingsStore } from "@/stores";
import AddWallpaperModal from "./modals/AddWallpaperModal";

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

export function WallpapersSection() {
    const [open, setOpen] = useState(false);
    const { settings, update } = useSettingsStore();

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

    const handleSelect = (id: string) => {
        update({ wallpaper: id });
    };

    const handleDelete = async (id: string) => {
        // 🚀 Updated delete function using Dexie syntax
        await db.wallpapers.delete(id);

        // 🪄 MAGIC: No need to manually call setCustomWallpapers() here!
        // useLiveQuery detects the deletion and automatically removes it from the UI.

        // If the deleted wallpaper was the active one, fallback to "default"
        if (settings?.wallpaper === id) {
            update({ wallpaper: "default" });
        }
    };

    // Helper to determine if a wallpaper should show the active checkmark
    const isWallpaperActive = (wpId: string) => {
        // 1. Exact match with the selected custom/default wallpaper ID
        if (settings?.wallpaper === wpId) return true;

        // 2. If no wallpaper is explicitly selected (or it's set to "default"), highlight the default wallpaper
        if (!settings?.wallpaper || settings?.wallpaper === "default") {
            if (wpId === "default") return true;
        }

        return false;
    };

    // Called by AddWallpaperModal when a new wallpaper is successfully saved
    const handleWallpaperAdded = (newId: string) => {
        // 🪄 MAGIC: No need to manually call fetchCustomWallpapers() here!
        // useLiveQuery detects the new addition and automatically adds it to the grid.

        // Automatically set the new wallpaper as active
        update({ wallpaper: newId });
    };

    return (
        <>
            <div className="flex flex-col gap-y-2">
                <div className="flex-center-between">
                    <BetterTypography as="h3" variant="md" weight="medium">

                        Wallpapers
                    </BetterTypography>

                    <Button
                        leftIcon={<ImagePlusIcon className="size-4" />}
                        onClick={() => setOpen(true)}
                    >
                        <BetterTypography as="span" variant="xs">
                            Add Wallpaper
                        </BetterTypography>
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
                    {allWallpapers.map((wp) => (
                        <WallpaperCard
                            key={wp.id}
                            lightVariant={wp.variants.light}
                            darkVariant={wp.variants.dark}
                            name={wp.name}
                            isActive={isWallpaperActive(wp.id)}
                            onSelect={() => handleSelect(wp.id)}
                            deletable={wp.id !== 'default'}
                            onDelete={() => handleDelete(wp.id)}
                        />
                    ))}
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