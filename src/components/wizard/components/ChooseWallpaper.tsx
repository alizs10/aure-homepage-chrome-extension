import WallpaperPicker from "@/components/common/WallpaperPicker";

export function ChooseWallpaper({
    value,
    onChange,
}: {
    value: string;
    onChange: (wallpaperId: string) => void;
}) {
    return (
        <WallpaperPicker
            value={value}
            onSelect={onChange}
            showAddInGrid={true}
            gridClassName="gap-1 sm:gap-2"
        />
    );
}