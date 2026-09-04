import { cn } from '@/lib/util';
import { MinusIcon } from 'lucide-react';
export default function EmptyRect() {
    return (
        <div
            className={
                cn(
                    "col-span-1 row-span-1 h-full flex-center bg-secondary",
                )
            } >

            <MinusIcon className='text-secondary-foreground/30 dark:text-secondary-foreground/60 size-2' />
        </div>
    )
}
