import { useMemo } from 'react';
import { getQuarterBuckets, groupHistoryByBuckets } from '../helpers/history';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodRect from './MoodRect';
import EmptyRect from './EmptyRect';
import { parseISO } from 'date-fns';

export default function HistoryQuartersList() {
    // 🌟 FIX: Destructure todayStr
    const { data, todayStr } = useMoodTracker();

    // 🌟 FIX: Use parseISO(todayStr) for perfect synchronization
    const buckets = useMemo(() => getQuarterBuckets(parseISO(todayStr)), [todayStr]);

    // This already contains ALL 4 quarters
    const quartersData = useMemo(() => {
        return groupHistoryByBuckets(data, buckets);
    }, [data, buckets]);

    const allBlocks = 4;

    return (
        <div className={`grid grid-cols-2 gap-0`}>
            {quartersData.map((quarter, i) => {
                if (quarter.items.length > 0) {
                    return (
                        <MoodRect
                            key={quarter.label}
                            items={quarter.items}
                            label={quarter.label}
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