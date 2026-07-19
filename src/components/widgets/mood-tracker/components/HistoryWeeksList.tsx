import { useMemo } from 'react';
import { getMonthWeekBuckets, groupHistoryByBuckets } from '../helpers/history';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodRect from './MoodRect';
import EmptyRect from './EmptyRect';
import { parseISO } from 'date-fns';

export default function HistoryWeeksList() {
    // 🌟 FIX: Destructure todayStr
    const { data, todayStr } = useMoodTracker();

    // 🌟 FIX: Use parseISO(todayStr) for perfect synchronization
    const buckets = useMemo(() => getMonthWeekBuckets(parseISO(todayStr)), [todayStr]);

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