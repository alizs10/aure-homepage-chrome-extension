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
        return length === 6 ? 'grid-cols-6' : length === 5 ? 'grid-cols-5' : 'grid-cols-4';
    }

    return (
        <div className={`grid ${getGridClass()} grid-rows-1 flex-1 min-h-0 rounded-xl overflow-clip gap-0.5`}>
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
                return <EmptyRect key={`empty-${i}`} />;
            })}
        </div>
    )
}