import { type RefObject, useEffect } from "react";

export function useScrollToBottom<T extends HTMLElement>(
    ref: RefObject<T | null>,
    dependency: unknown
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // ✅ FIX: Wait for the next animation frame so the browser finishes 
        // laying out the new DOM elements (and padding) before we measure scrollHeight.
        const raf = requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });

        // Cleanup function to prevent memory leaks or scrolling on unmounted components
        return () => cancelAnimationFrame(raf);
    }, [ref, dependency]);
}