import { useEffect, type ReactNode } from "react";
import { useSettingsStore } from "@/stores";

export function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const theme = useSettingsStore((s) => s.settings?.theme);

    useEffect(() => {
        if (!theme) return;

        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const applyTheme = () => {
            const isDark =
                theme === "dark" ||
                (theme === "system" && mediaQuery.matches);

            document.documentElement.classList.toggle("dark", isDark);
        };

        applyTheme();

        mediaQuery.addEventListener("change", applyTheme);

        return () => {
            mediaQuery.removeEventListener("change", applyTheme);
        };
    }, [theme]);

    return children;
}