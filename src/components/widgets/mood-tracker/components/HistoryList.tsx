import { useCallback, useMemo } from 'react';
import { filterHistoryByRange, getMonthWeekBuckets, getQuarterBuckets, groupHistoryByBuckets } from '../helpers/history';
import { useMoodTracker } from '../hooks/useMoodTracker';
import MoodWeekRect from './MoodRect';
import MoodSquare from './MoodSquare';

function HistoryDaysList() {
    const { data, filter } = useMoodTracker()

    const filteredData = useMemo(() => {

        return filterHistoryByRange(data, filter);

    }, [data, filter]);


    return (
        <div className="grid grid-cols-15 gap-1">
            {filteredData?.map(history => (
                <MoodSquare key={history.id} moodDayItem={history} />
            ))}
        </div>
    )
}

function HistoryWeeksList() {
    const { data, today } = useMoodTracker()

    const filteredData = useMemo(() => {

        const buckets = getMonthWeekBuckets(today)

        return groupHistoryByBuckets(data, buckets)

    }, [data, today]);

    const getGridClass = useCallback(() => {

        const length = filteredData.length;

        switch (length) {
            case 4:
                return "grid-cols-2"
                break;

            default:
                return "grid-cols-3"
                break;
        }
    }, [filteredData.length])


    // return null

    return (
        <div className={`grid ${getGridClass()} gap-1`}>
            {filteredData?.map(week => week.items.length > 0 && (
                <MoodWeekRect key={week.label} items={week.items} label={week.label} />
            ))}
        </div>
    )
}

function HistoryQuartersList() {
    const { data, today } = useMoodTracker()

    const filteredData = useMemo(() => {

        const buckets = getQuarterBuckets(today)

        return groupHistoryByBuckets(data, buckets)

    }, [data, today]);

    // return null

    return (
        <div className={`grid grid-cols-2 gap-1`}>
            {filteredData?.map(week => week.items.length > 0 && (
                <MoodWeekRect key={week.label} items={week.items} label={week.label} />
            ))}
        </div>
    )
}


export default function HistoryList() {

    const { filter } = useMoodTracker()

    if (filter === 'last30days' || filter === 'thisWeek') {
        return <HistoryDaysList />
    }


    if (filter === 'thisMonth') {
        return <HistoryWeeksList />
    }

    if (filter === 'thisYear') {
        return <HistoryQuartersList />
    }



}
