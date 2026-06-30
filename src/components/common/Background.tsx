// import background from "../../assets/background/default.jpeg";
import lightBackground from "../../assets/background/default-light.jpg";
import darkBackground from "../../assets/background/default-dark-1.jpg";
import { motion } from 'framer-motion'
import { useImage } from '../../hooks/useImage';
import { useTheme } from "../../contexts/ThemeContext";
import { useMemo } from "react";


export default function Background() {

    const { resolvedTheme } = useTheme()

    const background = useMemo(() => {

        return resolvedTheme === 'dark' ? darkBackground : lightBackground

    }, [resolvedTheme, darkBackground, lightBackground])

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
                duration: .5
            }}
            className="absolute inset-0 -z-1 bg-center bg-cover"></motion.div>
    )
}
