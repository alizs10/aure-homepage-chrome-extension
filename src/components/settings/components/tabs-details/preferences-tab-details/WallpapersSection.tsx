import WallpaperPicker from "@/components/common/WallpaperPicker";
import { useSettingsStore } from "@/stores";

export function WallpapersSection() {
    const { settings, update } = useSettingsStore();

    return (
        <WallpaperPicker
            value={settings?.wallpaper}
            onSelect={(id) => update({ wallpaper: id })}
            headerAction={true}
        />
    );
}