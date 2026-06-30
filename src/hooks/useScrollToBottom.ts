import { type RefObject, useEffect } from "react";

export function useScrollToBottom<T extends HTMLElement>(
    ref: RefObject<T | null>,
    dependency: unknown
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight;
    }, [dependency]);
}