import { useEffect, useState } from "react";
import { ImagePlusIcon } from "lucide-react";

import WallpaperCard from "@/components/common/WallpaperCard";
import Button from "@/components/ui/Button";
import { BetterTypography } from "@/components/common/BetterTypography";
import AddWallpaperModal from "@/components/settings/components/tabs-details/preferences-tab-details/modals/AddWallpaperModal";
import { DEFAULT_WALLPAPERS, useWallpaperStore } from "@/features/wallpapers";
import { cn } from "@/lib/util";

export interface WallpaperPickerProps {
    value?: string;
    onSelect: (wallpaperId: string) => void;
    headerAction?: boolean;
    showAddInGrid?: boolean;
    gridClassName?: string;
    className?: string;
}

export default function WallpaperPicker({
    value = "default",
    onSelect,
    headerAction = false,
    showAddInGrid = false,
    gridClassName,
    className,
}: WallpaperPickerProps) {
    const [open, setOpen] = useState(false);
    const { customWallpapers, fetchWallpapers, deleteWallpaper } = useWallpaperStore();

    useEffect(() => {
        fetchWallpapers();
    }, [fetchWallpapers]);

    const allWallpapers = [...DEFAULT_WALLPAPERS, ...customWallpapers];

    const isWallpaperActive = (wpId: string) => {
        if (value === wpId) return true;
        if ((!value || value === "default") && wpId === "default") return true;
        return false;
    };

    const handleDelete = async (id: string) => {
        await deleteWallpaper(id);
        if (value === id) {
            onSelect("default");
        }
    };

    const handleWallpaperAdded = (newId: string) => {
        onSelect(newId);
    };

    return (
        <div className={cn("flex flex-col gap-y-2", className)}>
            {headerAction && (
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
            )}

            <div
                className={cn(
                    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4",
                    gridClassName
                )}
            >
                {allWallpapers.map((wp) => (
                    <WallpaperCard
                        key={wp.id}
                        lightVariant={wp.variants.light}
                        darkVariant={wp.variants.dark}
                        name={wp.name}
                        isActive={isWallpaperActive(wp.id)}
                        onSelect={() => onSelect(wp.id)}
                        deletable={wp.id !== "default"}
                        onDelete={() => handleDelete(wp.id)}
                    />
                ))}

                {showAddInGrid && (
                    <div
                        onClick={() => setOpen(true)}
                        className="aspect-video rounded-3xl bg-secondary/50 border-2 border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-y-4 cursor-pointer overflow-hidden relative"
                    >
                        <ImagePlusIcon className="size-6 xl:size-10 text-muted-foreground" />
                        <BetterTypography className="text-nowrap" variant="14-12-10-12-14" weight="medium">
                            Add Your Own Wallpaper
                        </BetterTypography>
                    </div>
                )}
            </div>

            {open && (
                <AddWallpaperModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onWallpaperChange={handleWallpaperAdded}
                />
            )}
        </div>
    );
}
