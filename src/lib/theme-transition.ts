// src/lib/theme-transition.ts
import { flushSync } from "react-dom";

type Theme = "light" | "dark" | "system";

export function triggerThemeTransition(
    newTheme: Theme,
    event: React.MouseEvent,
    updateTheme: (payload: { theme: Theme }) => void | Promise<void>
) {
    // 1. Fallback for browsers that don't support View Transitions, reduced motion, or Firefox
    // (Firefox Bug 1657997: WebRender offscreen snapshots omit backdrop-filter, so updating directly on live DOM preserves blur)
    const isFirefox =
        import.meta.env.VITE_TARGET_BROWSER === "firefox" ||
        (typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox"));

    if (
        !document.startViewTransition ||
        isFirefox ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        const isDark =
            newTheme === "dark" ||
            (newTheme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", isDark);
        updateTheme({ theme: newTheme });
        return;
    }

    // 2. Get the center of the clicked button
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 3. Calculate the maximum radius needed to cover the entire viewport
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    // 4. Set CSS variables for the animation
    document.documentElement.style.setProperty("--x", `${x}px`);
    document.documentElement.style.setProperty("--y", `${y}px`);
    document.documentElement.style.setProperty("--radius", `${endRadius}px`);

    // 5. Start transition and update theme
    const transition = document.startViewTransition(async () => {
        // Add .no-transitions INSIDE the callback so the browser doesn't
        // recalculate styles for the entire DOM tree before taking the old snapshot
        document.documentElement.classList.add("no-transitions");

        const isDark =
            newTheme === "dark" ||
            (newTheme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", isDark);

        flushSync(() => {
            updateTheme({ theme: newTheme });
        });
    });

    // 6. Clean up CSS variables and re-enable transitions after the animation finishes
    transition.finished.finally(() => {
        document.documentElement.style.removeProperty("--x");
        document.documentElement.style.removeProperty("--y");
        document.documentElement.style.removeProperty("--radius");
        document.documentElement.classList.remove("no-transitions");
    });
}