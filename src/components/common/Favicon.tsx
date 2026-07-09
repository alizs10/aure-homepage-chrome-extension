import { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";

// Optional: Extracted hook (improved version)
export function useImage(src: string) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    useEffect(() => {
        if (!src) {
            setStatus('error');
            return;
        }

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

    return status;
}

export default function Favicon({ url }: { url: string }) {
    const [showGlobe, setShowGlobe] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Early exit for localhost / internal addresses
    const isLocal = /^https?:\/\/(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(url);

    const src = (() => {
        if (isLocal) return '';
        try {
            const domain = new URL(url).hostname.replace(/^www\./, '');
            return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
        } catch {
            return '';
        }
    })();

    const imageStatus = useImage(src);

    // Show globe for local addresses or failed images
    useEffect(() => {
        if (isLocal || imageStatus === 'error') {
            setShowGlobe(true);
        }
    }, [isLocal, imageStatus]);

    if (showGlobe || !src) {
        return <Globe className="min-w-6 md:min-w-10 size-6 md:size-10 text-muted-foreground" />;
    }

    return (
        <img
            ref={imgRef}
            src={src}
            className="min-w-6 md:min-w-10 size-6 md:size-10 rounded-full"
            alt="Website favicon"
        />
    );
}