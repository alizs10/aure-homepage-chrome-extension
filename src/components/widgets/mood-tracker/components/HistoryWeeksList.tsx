import { useMemo } from 'react';
import { getMonthWeekBuckets, groupHistoryByBuckets } from '../helpers/history';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodRect from './MoodRect';
import EmptyRect from './EmptyRect';

export default function HistoryWeeksList() {
    const { data, today } = useMoodTracker()

    const buckets = useMemo(() => getMonthWeekBuckets(today), [today]);

    // This already contains ALL weeks (including empty ones)
    const weeksData = useMemo(() => {
        return groupHistoryByBuckets(data, buckets);
    }, [data, buckets]);

    const allBlocks = weeksData.length > 4 ? 6 : 4;

    const getGridClass = () => {
        const length = weeksData.length;
        return length > 4 ? 'grid-cols-3' : 'grid-cols-2';
    }

    return (
        <div className={`grid ${getGridClass()} gap-0`}>
            {weeksData.map((week, i) => {
                if (week.items.length > 0) {
                    return (
                        <MoodRect
                            key={week.label}
                            items={week.items}
                            label={week.label}
                            maxCount={allBlocks}
                        />
                    );
                }
                // Empty placeholder rendered in its correct chronological slot
                return <EmptyRect key={`empty-${i}`} maxCount={allBlocks} />;
            })}
        </div>
    )
}