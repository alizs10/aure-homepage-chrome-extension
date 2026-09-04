import { Moon, Sun } from "lucide-react";
import Button from "../ui/Button";
import { useSettingsStore } from "@/stores";
import { motion, AnimatePresence } from "framer-motion";
import { triggerThemeTransition } from "@/lib/theme-transition";
import Skeleton from "../ui/Skeleton";

export default function ThemeToggle() {
    const theme = useSettingsStore((s) => s.settings?.theme);
    const update = useSettingsStore((s) => s.update);
    const loading = useSettingsStore((s) => s.loading);

    if (loading || !theme) {
        // if (true) {
        return (
            <Skeleton className="size-6" />
        );
    }

    const isDark = theme === "dark";

    const handleToggle = (e: React.MouseEvent) => {
        const newTheme = isDark ? "light" : "dark";
        triggerThemeTransition(newTheme, e, update);
    };

    return (
        <Button
            onClick={handleToggle}
            size="icon-xs"
            variant="ghost"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                    >
                        <Moon className="size-4" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                    >
                        <Sun className="size-4" />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}