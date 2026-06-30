import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    mounted: boolean;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [theme, setTheme] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
        "light"
    );

    useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem("theme") as Theme | null;

        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const applyTheme = () => {
            const isDark =
                theme === "dark" ||
                (theme === "system" && mediaQuery.matches);

            document.documentElement.classList.toggle("dark", isDark);

            setResolvedTheme(isDark ? "dark" : "light");
        };

        applyTheme();

        localStorage.setItem("theme", theme);

        mediaQuery.addEventListener("change", applyTheme);

        return () => {
            mediaQuery.removeEventListener("change", applyTheme);
        };
    }, [theme, mounted]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                mounted,
                resolvedTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used within ThemeProvider"
        );
    }

    return context;
}