import { useEffect, useState } from "react";

export function useImage(src: string) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
        !src ? 'error' : 'loading'
    );

    // Track the previous src to detect changes during render
    const [prevSrc, setPrevSrc] = useState(src);

    // ✅ Good: Reset state during render when src changes
    if (src !== prevSrc) {
        setPrevSrc(src);
        setStatus(!src ? 'error' : 'loading');
    }

    useEffect(() => {
        if (!src) return;

        const img = new Image();

        img.onload = () => {
            // Extra check for Google's fake 404s (returns image with 0 size)
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                setStatus('error');
            } else {
                setStatus('loaded');
            }
        };

        img.onerror = () => setStatus('error');

        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    // Derive the final status to ensure empty src is always 'error'.
    return !src ? 'error' : status;
}