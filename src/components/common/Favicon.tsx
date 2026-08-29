import { Globe } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';

import { getFaviconUrl } from '@/lib/favicon';
import { cn } from '@/lib/util';

interface FaviconProps {
    url: string;
    className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function Favicon({
    url,
    className,
}: FaviconProps) {
    const faviconSrc = getFaviconUrl(url, 128);

    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    if (failedSrc === faviconSrc) {
        return (
            <div className={cn(className)}>
                <Globe className="size-full text-muted-foreground" />
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
                src={faviconSrc}
                className="size-full object-cover object-center"
                alt=""
                onError={() => {
                    setFailedSrc(faviconSrc);
                }}
            />
        </div>
    );
}