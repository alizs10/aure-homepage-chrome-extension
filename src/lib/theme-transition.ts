// src/lib/theme-transition.ts

type Theme = "light" | "dark" | "system";

export function triggerThemeTransition(
    newTheme: Theme,
    event: React.MouseEvent,
    updateTheme: (payload: { theme: Theme }) => void | Promise<void>
) {
    // 1. Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
        updateTheme({ theme: newTheme });
        return;
    }

    // 2. Fallback for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        updateTheme({ theme: newTheme });
        return;
    }

    // 3. Get the center of the clicked button
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 4. Calculate the maximum radius needed to cover the entire viewport
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    // 5. Set CSS variables for the animation
    document.documentElement.style.setProperty("--x", `${x}px`);
    document.documentElement.style.setProperty("--y", `${y}px`);
    document.documentElement.style.setProperty("--radius", `${endRadius}px`);

    // 6. CRITICAL: Disable CSS transitions globally to prevent anti-aliasing 
    // glitches on border-radius during the clip-path animation
    document.documentElement.classList.add("no-transitions");

    // 7. Start the transition and update the theme synchronously inside it
    const transition = document.startViewTransition(() => {
        updateTheme({ theme: newTheme });
    });

    // 8. Clean up CSS variables and re-enable transitions after the animation finishes
    transition.finished.then(() => {
        document.documentElement.style.removeProperty("--x");
        document.documentElement.style.removeProperty("--y");
        document.documentElement.style.removeProperty("--radius");
        document.documentElement.classList.remove("no-transitions");
    });
}