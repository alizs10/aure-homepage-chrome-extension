import { motion } from "framer-motion";
import { useImage } from "@/hooks/useImage";
import { useWallpaperBackground } from "@/hooks/useWallpaperBackground";

export default function Background() {
    const { background, isLoading } = useWallpaperBackground();
    const loaded = useImage(background);

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