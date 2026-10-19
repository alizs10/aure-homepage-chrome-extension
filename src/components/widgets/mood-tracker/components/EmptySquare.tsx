import { formatDisplayDate } from '@/helpers';
import { cn } from '@/lib/util';
import { format, parseISO, subDays } from 'date-fns';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodModal from '../modals/MoodModal';

interface EmptySquareProps {
    date?: Date;
    isFuture?: boolean;
}

export default function EmptySquare({ date, isFuture = false }: EmptySquareProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const { todayStr } = useMoodTracker();

    const dateStr = date ? format(date, "yyyy-MM-dd") : "";

    const formattedDateLabel = useMemo(() => {
        if (!date || !dateStr) return "";
        if (dateStr === todayStr) return "Today";
        const yesterdayStr = format(subDays(parseISO(todayStr), 1), "yyyy-MM-dd");
        if (dateStr === yesterdayStr) return "Yesterday";
        return format(date, "EEE, MMM d");
    }, [date, dateStr, todayStr]);

    if (!date || isFuture) {
        return (
            <div
                className={cn(
                    "col-span-1 row-span-1 h-full flex-center cursor-default",
                    isFuture ? "bg-secondary/40" : "bg-secondary"
                )}
                title={date ? `${formatDisplayDate(date, "MMM dd")}${isFuture ? " (Future)" : ""}` : undefined}
            >
                <MinusIcon className="text-secondary-foreground/20 dark:text-secondary-foreground/40 size-2" />
            </div>
        );
    }

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={() => setModalOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setModalOpen(true);
                    }
                }}
                title={`Missed day (${formattedDateLabel}) - Click to choose mood`}
                className={cn(
                    "col-span-1 row-span-1 h-full bg-secondary hover:bg-secondary/70 flex-center cursor-pointer outline-none transition-colors group"
                )}
            >
                <MinusIcon className="text-secondary-foreground/30 dark:text-secondary-foreground/60 size-2 group-hover:hidden" />
                <PlusIcon className="text-primary size-2.5 hidden group-hover:block transition-transform scale-110" />
            </div>

            {modalOpen && (
                <MoodModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    date={date}
                />
            )}
        </>
    );
}