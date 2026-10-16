import { Globe } from 'lucide-react';
import { useEffect, useState, type HTMLAttributes } from 'react';

import {
    extractDomain,
    getFaviconDataUrl,
    getInitialFaviconSrc,
    isFirefox,
} from '@/lib/favicon';
import { cn } from '@/lib/util';

interface FaviconProps {
    url: string;
    className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function Favicon({
    url,
    className,
}: FaviconProps) {
    const initialSrc = getInitialFaviconSrc(url, 128);
    const [prevUrl, setPrevUrl] = useState(url);
    const [src, setSrc] = useState<string | null>(initialSrc);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    if (prevUrl !== url) {
        setPrevUrl(url);
        setSrc(initialSrc);
        setFailedSrc(null);
    }

    const domain = extractDomain(url);
    const isFailed = !domain || failedSrc === url || (src !== null && failedSrc === src);

    useEffect(() => {
        if (!isFirefox || src || !domain) return;

        let isMounted = true;
        getFaviconDataUrl(url).then((dataUrl) => {
            if (!isMounted) return;
            if (dataUrl) {
                setSrc(dataUrl);
            } else {
                setFailedSrc(url);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [url, src, domain]);

    if (isFailed) {
        return (
            <div className={cn(className)}>
                <Globe className="size-full text-muted-foreground" />
            </div>
        );
    }

    if (!src) {
        return (
            <div
                className={cn(
                    className,
                    'relative overflow-clip flex items-center justify-center'
                )}
            >
                <Globe className="size-full text-muted-foreground/30 animate-pulse" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                className,
                'relative overflow-clip'
            )}
        >
            <img
                src={src}
                className="size-full object-cover object-center"
                alt=""
                onError={() => {
                    setFailedSrc(src);
                }}
            />
        </div>
    );
}