import { Typography } from "@/components/common/Typography";
import { db } from "@/lib/db";
import type { Wallpaper } from "@/types"; // Adjust path to your types file
import { ImagePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
// Import default wallpapers 
import defaultDark1 from "@/assets/background/default-dark-1.jpg";
import defaultLight from "@/assets/background/default-light.jpg";
import WallpaperCard from "@/components/common/WallpaperCard";
import AddWallpaperModal from "@/components/settings/components/tabs-details/preferences-tab-details/modals/AddWallpaperModal";

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

    const isWallpaperActive = (id: string) => value === id;

    const [open, setOpen] = useState(false);
    const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>([]);


    // Combine default and custom wallpapers for rendering
    const allWallpapers = [...DEFAULT_WALLPAPERS, ...customWallpapers];

    // Helper to fetch wallpapers from IndexedDB
    const fetchCustomWallpapers = async () => {
        const wps = await db.getAll("wallpapers");

        console.log("Fetched wallpapers from IndexedDB:", wps);
        setCustomWallpapers(wps.map(wp => ({ ...wp })));
    };

    // Fetch custom wallpapers from IndexedDB on mount
    useEffect(() => {

        const init = () => {
            fetchCustomWallpapers();
        }



        init()
    }, []);

    const handleDelete = async (id: string) => {
        await db.remove("wallpapers", id);
        setCustomWallpapers((prev) => prev.filter((wp) => wp.id !== id));
    };

    const handleWallpaperAdded = () => {
        fetchCustomWallpapers(); // Refresh the grid
        // update({ wallpaper: newId }); // Automatically set the new wallpaper as active
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
                        <ImagePlusIcon className="size-6 lg:size-10 text-muted-foreground" />
                        <Typography className="text-nowrap" variant="caption-xxs" weight="medium">
                            Add Your Own Wallpaper
                        </Typography>
                    </div>
                </div>



                {/* <Button
                type="button"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                <Typography variant="body" weight="medium">
                    {preview ? "Change Wallpaper" : "Choose Wallpaper"}
                </Typography>
            </Button> */}
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