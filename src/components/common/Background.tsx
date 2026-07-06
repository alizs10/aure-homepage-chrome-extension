import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useSettingsStore } from "@/stores";
import { db } from "@/lib/db";

import lightBackground from "../../assets/background/default-light.jpg";
import darkBackground from "../../assets/background/default-dark-1.jpg";

import { useImage } from "../../hooks/useImage";
import { useTheme } from "../../hooks/useTheme";
import type { Wallpaper } from "@/types/settings"; // Adjust path to your Settings types

export default function Background() {
    const { resolvedTheme } = useTheme();

    // Get the wallpaper ID from the settings store
    const wallpaperId = useSettingsStore((s) => s.settings?.wallpaper);

    const defaultBackground = resolvedTheme === "dark" ? darkBackground : lightBackground;

    // Store the entire wallpaper object to avoid re-querying IndexedDB on theme changes
    const [wallpaperData, setWallpaperData] = useState<Wallpaper | null>(null);

    // Fetch the wallpaper data from IndexedDB when the ID changes
    useEffect(() => {
        // If no wallpaper is selected, or if it's explicitly set to "default"
        if (!wallpaperId || wallpaperId === "default") {
            setWallpaperData(null);
            return;
        }

        db.get("wallpapers", wallpaperId)
            .then((wp) => {
                if (wp && "variants" in wp) {
                    setWallpaperData(wp as Wallpaper);
                } else {
                    setWallpaperData(null); // Fallback if DB record is missing/invalid
                }
            })
            .catch(() => setWallpaperData(null)); // Fallback on DB error
    }, [wallpaperId]);

    // Determine the correct variant based on the current theme
    // Includes a smart fallback: if the dark variant is missing, it uses the light one (and vice versa)
    const customBackground = wallpaperData
        ? (resolvedTheme === "dark"
            ? (wallpaperData.variants.dark || wallpaperData.variants.light)
            : (wallpaperData.variants.light || wallpaperData.variants.dark))
        : null;

    // Use custom background if available, otherwise fallback to default theme background
    const background = customBackground || defaultBackground;

    // useImage handles preloading (works with both imported assets and base64 data URLs)
    const loaded = useImage(background);

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