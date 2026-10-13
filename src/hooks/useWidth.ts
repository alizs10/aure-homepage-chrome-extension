import { useEffect, useState } from "react";

export type BreakPoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

function getBreakPoint(windowWidth: number): BreakPoints {
    if (windowWidth < 480) return 'xs';
    if (windowWidth < 640) return 'sm';
    if (windowWidth < 768) return 'md';
    if (windowWidth < 1024) return 'lg';
    if (windowWidth < 1280) return 'xl';
    return '2xl';
}

function getViewportSize(windowWidth: number): ViewportSize {
    if (windowWidth < 640) return 'mobile';
    if (windowWidth < 1024) return 'tablet';
    return 'desktop';
}

export default function useWidth() {
    const [width, setWidth] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth : 0
    );
    const [breakPKey, setBreakPKey] = useState<BreakPoints>(() =>
        getBreakPoint(typeof window !== 'undefined' ? window.innerWidth : 0)
    );
    const [viewportSize, setViewportSize] = useState<ViewportSize>(() =>
        getViewportSize(typeof window !== 'undefined' ? window.innerWidth : 0)
    );

    useEffect(() => {
        let timeoutId: number | null = null;

        function handleResize() {
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(() => {
                const windowWidth = window.innerWidth;
                setWidth(windowWidth);
                setBreakPKey(getBreakPoint(windowWidth));
                setViewportSize(getViewportSize(windowWidth));
            }, 100);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return { width, breakPKey, viewportSize };
}