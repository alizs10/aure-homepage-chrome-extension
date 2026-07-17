import { useMemo } from 'react';
import { getQuarterBuckets, groupHistoryByBuckets } from '../helpers/history';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodRect from './MoodRect';
import EmptyRect from './EmptyRect';

export default function HistoryQuartersList() {
    const { data, today } = useMoodTracker()

    const filteredData = useMemo(() => {

        const buckets = getQuarterBuckets(today)

        return groupHistoryByBuckets(data, buckets)

    }, [data, today]);

    const quartersData = useMemo(() => {

        return filteredData.filter(q => q.items.length > 0)

    }, [filteredData])

    const allBlocks = 4;
    const emptyBlocks = allBlocks - quartersData.length;

    return (
        <div className={`grid grid-cols-2 gap-0`}>
            {quartersData?.map(quarter => (
                <MoodRect key={quarter.label} items={quarter.items} label={quarter.label} maxCount={allBlocks} />
            ))}
            {Array.from({ length: emptyBlocks }).map((_, i) => (
                <EmptyRect key={i} maxCount={allBlocks} />
            ))}
        </div>
    )
}
