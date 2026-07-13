import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";

import { useSettingsStore } from "@/stores";
import { db } from "@/lib/db";

import lightBackground from "../../assets/background/default-light.jpg";
import darkBackground from "../../assets/background/default-dark-1.jpg";

import { useImage } from "../../hooks/useImage";
import { useTheme } from "../../hooks/useTheme";
import type { Wallpaper } from "@/types";

export default function Background() {
    const { resolvedTheme } = useTheme();

    // Get the wallpaper ID from the settings store
    const loading = useSettingsStore((s) => s.loading);
    const wallpaperId = useSettingsStore((s) => s.settings?.wallpaper);

    const defaultBackground = resolvedTheme === "dark" ? darkBackground : lightBackground;

    // 1. Removed the 3rd argument (null) to fix the "Expected 1-2 arguments" error.
    // 2. The return type is now `Wallpaper | null | undefined`.
    const wallpaperData = useLiveQuery<Wallpaper | null>(
        async () => {
            if (!wallpaperId || wallpaperId === "default") {
                return null;
            }

            const wp = await db.wallpapers.get(wallpaperId);

            // We cast to Wallpaper to satisfy TypeScript
            return wp && "variants" in wp ? (wp as Wallpaper) : null;
        },
        [wallpaperId]
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


    // 3. Handle the `undefined` loading state here.
    // If it's undefined, it's still loading. If it's null, it's explicitly empty/default.
    if ((!wallpaperData && wallpaperId !== 'default') || loading) {
        // Optional: You could render a loading spinner or just the default background while loading
        // For now, we'll just fallback to the default background
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