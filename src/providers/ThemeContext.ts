import { createContext, useContext } from "react";
import type { Theme } from "@/types";

export interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    isDark: boolean;
    setTheme: (theme: Theme) => Promise<void>;
    loading: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeContext() {
    return useContext(ThemeContext);
}
