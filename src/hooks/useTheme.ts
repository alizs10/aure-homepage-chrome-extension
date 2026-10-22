import { useThemeContext, type ThemeContextValue } from "@/providers/ThemeContext";
import { useSettingsStore } from "@/stores";
import type { Theme } from "@/types";

export function useTheme(): ThemeContextValue {
    const context = useThemeContext();

    if (context) {
        return context;
    }

    // Fallback for isolated components rendered outside ThemeProvider
    const theme = useSettingsStore.getState().settings?.theme ?? "system";
    const systemIsDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const resolvedTheme: "light" | "dark" =
        theme === "dark" || (theme === "system" && systemIsDark) ? "dark" : "light";

    return {
        theme,
        resolvedTheme,
        isDark: resolvedTheme === "dark",
        setTheme: async (newTheme: Theme) => {
            await useSettingsStore.getState().update({ theme: newTheme });
        },
        loading: useSettingsStore.getState().loading,
    };
}