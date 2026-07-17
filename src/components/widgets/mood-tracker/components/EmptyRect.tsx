import { cn } from '@/lib/util';
// import { useMoodTracker } from '../hooks/useMoodTracker';

export default function EmptyRect({ maxCount }: { maxCount: number }) {
    // const { filter } = useMoodTracker();


    return (
        <div
            className={
                cn(
                    "col-span-1 h-5 bg-secondary",
                    "border-r border-muted first:rounded-tl-sm last:rounded-br-sm last-of-type:border-r-0",
                    maxCount === 4 ? "nth-[-n+2]:border-b nth-of-type-2:border-r-0" : "nth-[-n+3]:border-b nth-of-type-3:border-r-0",

                    maxCount === 4 ? "nth-of-type-2:rounded-tr-sm nth-of-type-3:rounded-bl-sm" : "nth-of-type-3:rounded-tr-sm nth-of-type-4:rounded-bl-sm",
                )
            } />
    )
}
