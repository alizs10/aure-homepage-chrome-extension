import { useEffect, useMemo, useState } from "react";
import { useSettingsStore } from "@/stores";
import type { Theme } from "@/types";

export function useTheme() {
    const theme = useSettingsStore((s) => s.settings?.theme);
    const update = useSettingsStore((s) => s.update);
    const loading = useSettingsStore((s) => s.loading);

    const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (event: MediaQueryListEvent) => {
            setSystemTheme(event.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const resolvedTheme = useMemo<"light" | "dark">(() => {
        if (!theme || theme === "system") {
            return systemTheme;
        }

        return theme;
    }, [theme, systemTheme]);

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            resolvedTheme === "dark"
        );
    }, [resolvedTheme]);

    const setTheme = async (theme: Theme) => {
        await update({ theme });
    };

    return {
        theme: theme ?? "system",
        resolvedTheme,
        setTheme,
        loading,
    };
}