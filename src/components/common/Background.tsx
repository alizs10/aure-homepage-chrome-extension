import { motion } from "framer-motion";
import { useImage } from "@/hooks/useImage";
import { useWallpaperBackground } from "@/hooks/useWallpaperBackground";
import { useSettingsStore } from "@/stores";
import { wallpaperBlurOptions, wallpaperBrightnessOptions } from "@/types";
import { isFirefox } from "@/lib/browser";
import { isColor } from "@/features/wallpapers";

export default function Background() {
    const { background, isLoading } = useWallpaperBackground();
    const isColorBg = isColor(background);
    const status = useImage(isColorBg ? "" : (background ?? ""));
    const isLoaded = isColorBg ? true : status === "loaded";

    const wallpaperBlur = useSettingsStore((s) => s.preview?.wallpaper_blur ?? s.settings?.wallpaper_blur ?? (isFirefox ? "xs" : "none"));
    const wallpaperBrightness = useSettingsStore((s) => s.preview?.wallpaper_brightness ?? s.settings?.wallpaper_brightness ?? "100");

    const blurOption = wallpaperBlurOptions.find((opt) => opt.key === wallpaperBlur);
    const brightnessOption = wallpaperBrightnessOptions.find((opt) => opt.key === wallpaperBrightness);

    const blurValue = blurOption?.value ?? "0px";
    const brightnessValue = brightnessOption?.value ?? "100%";

    if (isLoading && !background) {
        return null;
    }

    return (
        <motion.div
            key={background}
            style={{
                backgroundColor: isColorBg ? background : undefined,
                backgroundImage: isColorBg ? undefined : `url(${background})`,
            }}
            initial={{
                opacity: 0,
                filter: `blur(${blurValue}) brightness(${brightnessValue})`,
            }}
            animate={{
                opacity: isLoaded ? 1 : 0,
                filter: `blur(${blurValue}) brightness(${brightnessValue})`,
            }}
            transition={{
                opacity: { ease: "linear", duration: 0.5 },
                filter: { ease: "easeOut", duration: 0.3 },
            }}
            className="absolute -inset-16 -z-1 bg-center bg-cover"
        />
    );
}