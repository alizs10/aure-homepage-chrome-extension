import { useLiveQuery } from "dexie-react-hooks";
import { useSettingsStore } from "@/stores";
import { db } from "@/lib/db";
import { useTheme } from "./useTheme";

// Adjust these paths if your assets folder is located differently
import lightBackground from "../assets/background/default-light.webp";
import darkBackground from "../assets/background/default-dark.webp";

export function useWallpaperBackground() {
    const { resolvedTheme } = useTheme();
    const loading = useSettingsStore((s) => s.loading);
    const wallpaperId = useSettingsStore((s) => s.settings?.wallpaper);

    const defaultBackground = resolvedTheme === "dark" ? darkBackground : lightBackground;

    const wallpaperData = useLiveQuery(
        async () => {
            if (loading) return undefined;
            if (!wallpaperId || wallpaperId === "default") return null;
            return (await db.wallpapers.get(wallpaperId)) ?? null;
        },
        [loading, wallpaperId]
    );

    const customBackground = wallpaperData
        ? resolvedTheme === "dark"
            ? wallpaperData.variants.dark || wallpaperData.variants.light
            : wallpaperData.variants.light || wallpaperData.variants.dark
        : null;

    const background = customBackground || defaultBackground;
    const isLoading = loading || wallpaperData === undefined;

    return { background, isLoading };
}