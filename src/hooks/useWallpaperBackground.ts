import { useEffect } from "react";
import { useSettingsStore } from "@/stores";
import { useWallpaperStore } from "@/features/wallpapers";
import { useTheme } from "./useTheme";

import lightBackground from "../assets/background/default-light.webp";
import darkBackground from "../assets/background/default-dark.webp";

export function useWallpaperBackground() {
    const { resolvedTheme } = useTheme();
    const settingsLoading = useSettingsStore((s) => s.loading);
    const wallpaperId = useSettingsStore((s) => s.settings?.wallpaper);
    const customWallpapers = useWallpaperStore((s) => s.customWallpapers);
    const fetchWallpapers = useWallpaperStore((s) => s.fetchWallpapers);

    useEffect(() => {
        fetchWallpapers();
    }, [fetchWallpapers]);

    const activeWallpaper = (!wallpaperId || wallpaperId === "default")
        ? null
        : (customWallpapers.find((w) => w.id === wallpaperId) ?? null);

    const defaultBackground = resolvedTheme === "dark" ? darkBackground : lightBackground;

    const customBackground = activeWallpaper
        ? resolvedTheme === "dark"
            ? activeWallpaper.variants.dark || activeWallpaper.variants.light
            : activeWallpaper.variants.light || activeWallpaper.variants.dark
        : null;

    const background = customBackground || defaultBackground;
    const isLoading = settingsLoading && !wallpaperId;

    return { background, isLoading };
}