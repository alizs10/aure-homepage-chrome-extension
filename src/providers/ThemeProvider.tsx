import { useEffect, useState, type ReactNode } from "react";
import { useSettingsStore } from "@/stores";
import type { Theme } from "@/types";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const theme = useSettingsStore((s) => s.settings?.theme) ?? "system";
    const update = useSettingsStore((s) => s.update);
    const loading = useSettingsStore((s) => s.loading);

    const [systemIsDark, setSystemIsDark] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
            : false
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (event: MediaQueryListEvent) => {
            setSystemIsDark(event.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const resolvedTheme: "light" | "dark" =
        theme === "dark" || (theme === "system" && systemIsDark) ? "dark" : "light";

    useEffect(() => {
        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }, [resolvedTheme]);

    const setTheme = async (newTheme: Theme) => {
        await update({ theme: newTheme });
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                isDark: resolvedTheme === "dark",
                setTheme,
                loading,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}