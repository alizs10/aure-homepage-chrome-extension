import { cn } from '@/lib/util';
import { MinusIcon } from 'lucide-react';

interface EmptyRectProps {
    label?: string;
}

export default function EmptyRect({ label }: EmptyRectProps) {
    return (
        <div
            title={label ? `${label}: No moods logged` : undefined}
            className={cn(
                "col-span-1 row-span-1 h-full flex-center bg-secondary cursor-default",
            )}
        >
            <MinusIcon className='text-secondary-foreground/30 dark:text-secondary-foreground/60 size-2' />
        </div>
    );
}
