import { useState, useCallback } from 'react';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import { copyToClipboard } from '@/helpers';
import { toast } from '@/stores/useToastStore';
import { cn } from '@/lib/util';
import Button from './Button';
import { BetterTypography } from '../common/BetterTypography';

export interface ClickToCopyProps {
    text: string;
    label?: string;
    className?: string;
    successMessage?: string;
    onCopy?: () => void;
}

export default function ClickToCopy({
    text,
    label,
    className,
    successMessage = "Copied to clipboard!",
    onCopy,
}: ClickToCopyProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (copied) return;

        const success = await copyToClipboard(text);
        if (success) {
            setCopied(true);
            toast.success(successMessage, { duration: 2000 });
            onCopy?.();

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } else {
            toast.error("Failed to copy to clipboard", { duration: 2000 });
        }
    }, [copied, text, successMessage, onCopy]);

    return (
        <Button
            type="button"
            size='xs'
            onClick={handleCopy}
            title="Click to copy"
            className={cn(
                className,
                "px-3"
            )}
        >
            <BetterTypography variant='xxs'>
                {label ?? text}
            </BetterTypography>
            {copied ? (
                <CopyCheckIcon className="size-3.5 text-success shrink-0 transition-transform duration-150 scale-110" />
            ) : (
                <CopyIcon className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors duration-150" />
            )}
        </Button>
    );
}
