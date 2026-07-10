import { Typography } from "@/components/common/Typography";
import { db } from "@/lib/db";
import { useSettingsStore } from "@/stores";
import { useEffect, useState } from "react";

// Import default wallpapers 
import defaultDark1 from "@/assets/background/default-dark-1.jpg";
import defaultLight from "@/assets/background/default-light.jpg";
import Button from "@/components/common/Button";
import WallpaperCard from "@/components/common/WallpaperCard";
import type { Wallpaper } from "@/types";
import AddWallpaperModal from "./modals/AddWallpaperModal";
import { ImagePlusIcon } from "lucide-react";

// Define default wallpapers with a single "default" ID
const DEFAULT_WALLPAPERS: Wallpaper[] = [
    { id: "default", name: "Default", variants: { light: defaultLight, dark: defaultDark1 } }
];

export function WallpapersSection() {
    const [open, setOpen] = useState(false);

    const { settings, update } = useSettingsStore();
    const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>([]);

    // Helper to fetch wallpapers from IndexedDB
    const fetchCustomWallpapers = async () => {
        const wps = await db.getAll("wallpapers");
        setCustomWallpapers(wps.map(wp => ({ ...wp })));
    };

    // Fetch custom wallpapers from IndexedDB on mount
    useEffect(() => {

        const init = () => {
            fetchCustomWallpapers();
        }



        init()
    }, []);

    // Combine default and custom wallpapers for rendering
    const allWallpapers = [...DEFAULT_WALLPAPERS, ...customWallpapers];

    const handleSelect = (id: string) => {
        update({ wallpaper: id });
    };

    const handleDelete = async (id: string) => {
        await db.remove("wallpapers", id);
        setCustomWallpapers((prev) => prev.filter((wp) => wp.id !== id));

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
    const handleWallpaperAdded = () => {
        fetchCustomWallpapers(); // Refresh the grid
        // update({ wallpaper: newId }); // Automatically set the new wallpaper as active
    };

    return (
        <>
            <div className="flex flex-col gap-y-2">
                <div className="flex-center-between">
                    <Typography variant="h3">
                        Wallpapers
                    </Typography>

                    <Button
                        leftIcon={<ImagePlusIcon className="size-4" />}
                        onClick={() => setOpen(true)}
                    >
                        Add Wallpaper
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