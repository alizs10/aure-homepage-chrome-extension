import { cn } from '@/lib/util'
import { useMoodTracker } from '../hooks/useMoodTracker';

export default function EmptySquare() {

    const { filter } = useMoodTracker();


    return (
        <div className={cn(`col-span-1 aspect-square bg-secondary ${filter === 'thisWeek' ? "" : "nth-[-n+15]:border-b"} last-of-type:border-r-0 nth-of-type-15:border-r-0
     border-r border-muted`, filter === "thisWeek" ? "first-of-type:rounded-l-sm last-of-type:rounded-r-sm" : "first-of-type:rounded-tl-sm last-of-type:rounded-br-sm nth-of-type-15:rounded-tr-sm nth-of-type-16:rounded-bl-sm")} />
    )
}
