import WallpaperPicker from "@/components/common/WallpaperPicker";
import { useSettingsStore } from "@/stores";

export function WallpapersSection({
    value,
    onSelect,
    gridClassName,
}: {
    value?: string;
    onSelect?: (id: string) => void;
    gridClassName?: string;
} = {}) {
    const { settings, update } = useSettingsStore();

    return (
        <WallpaperPicker
            value={value !== undefined ? value : settings?.wallpaper}
            onSelect={(id) => {
                if (onSelect) onSelect(id);
                else update({ wallpaper: id });
            }}
            headerAction={true}
            gridClassName={gridClassName}
        />
    );
}