import { useCallback, useMemo } from 'react';
import { getMonthWeekBuckets, groupHistoryByBuckets } from '../helpers/history';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodRect from './MoodRect';
import EmptyRect from './EmptyRect';

export default function HistoryWeeksList() {
    const { data, today } = useMoodTracker()

    const filteredData = useMemo(() => {

        const buckets = getMonthWeekBuckets(today)

        return groupHistoryByBuckets(data, buckets)

    }, [data, today]);

    const weeksData = useMemo(() => {

        return filteredData.filter(d => d.items.length > 0)

    }, [filteredData])

    const allBlocks = weeksData.length > 4 ? 6 : 4;
    const emptyBlocks = allBlocks - weeksData.length;

    const getGridClass = useCallback(() => {

        const length = weeksData.length;

        return length > 4 ? 'grid-cols-3' : 'grid-cols-2'

    }, [weeksData.length])


    // return null

    return (
        <div className={`grid ${getGridClass()} gap-0`}>
            {weeksData?.map(week => (
                <MoodRect key={week.label} items={week.items} label={week.label} maxCount={allBlocks} />
            ))}
            {Array.from({ length: emptyBlocks }).map((_, i) => (
                <EmptyRect key={i} maxCount={allBlocks} />
            ))}
        </div>
    )
}
