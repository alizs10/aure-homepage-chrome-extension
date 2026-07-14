import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";

import { useSettingsStore } from "@/stores";
import { db } from "@/lib/db";

import lightBackground from "../../assets/background/default-light.webp";
import darkBackground from "../../assets/background/default-dark.webp";

import { useImage } from "../../hooks/useImage";
import { useTheme } from "../../hooks/useTheme";

export default function Background() {
    const { resolvedTheme } = useTheme();

    // Get the wallpaper ID from the settings store
    const loading = useSettingsStore((s) => s.loading);
    const wallpaperId = useSettingsStore((s) => s.settings?.wallpaper);

    const defaultBackground = resolvedTheme === "dark" ? darkBackground : lightBackground;

    // 1. Removed the 3rd argument (null) to fix the "Expected 1-2 arguments" error.
    // 2. The return type is now `Wallpaper | null | undefined`.
    const wallpaperData = useLiveQuery(
        async () => {
            // Settings aren't ready yet.
            if (loading) return undefined;

            // We know the answer now: use the default wallpaper.
            if (!wallpaperId || wallpaperId === "default") {
                return null;
            }

            // Query finished. Either a wallpaper or null.
            return (await db.wallpapers.get(wallpaperId)) ?? null;
        },
        [loading, wallpaperId]
    );

    // Determine the correct variant based on the current theme
    // Because we handle `undefined` above, we only check for `null` here.
    const customBackground = wallpaperData
        ? resolvedTheme === "dark"
            ? wallpaperData.variants.dark || wallpaperData.variants.light
            : wallpaperData.variants.light || wallpaperData.variants.dark
        : null;

    const background = customBackground || defaultBackground;

    const loaded = useImage(background);


    const isLoading =
        loading ||
        wallpaperData === undefined;

    if (isLoading) {
        return null;
    }

    return (
        <motion.div
            style={{
                backgroundImage: `url(${background})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{
                ease: "linear",
                duration: 0.5,
            }}
            className="absolute inset-0 -z-1 bg-center bg-cover"
        />
    );
}