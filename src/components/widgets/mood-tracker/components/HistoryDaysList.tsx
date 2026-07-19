import { useMemo } from "react";
import { useMoodTracker } from "../hooks/useMoodTracker";
import { filterHistoryByRange } from "../helpers/history";
import { parseDate } from "@/helpers";
import { eachDayOfInterval, format, startOfWeek, endOfWeek, subDays, parseISO } from "date-fns";
import MoodSquare from "./MoodSquare";
import EmptySquare from "./EmptySquare";

export default function HistoryDaysList() {
    const { data, filter, todayStr } = useMoodTracker();

    const filteredData = useMemo(() => {
        return filterHistoryByRange(data, filter);
    }, [data, filter]);

    // Generate the exact chronological days we want to display
    const displayDays = useMemo(() => {
        // 🌟 FIX: Use dynamic current date
        const now = parseISO(todayStr);

        if (filter === 'thisWeek') {
            return eachDayOfInterval({
                start: startOfWeek(now, { weekStartsOn: 1 }),
                end: endOfWeek(now, { weekStartsOn: 1 })
            });
        }
        return eachDayOfInterval({
            start: subDays(now, 29),
            end: now
        });
    }, [filter, todayStr]);

    // Create a Map for O(1) lookup to avoid nested loops
    const dataMap = useMemo(() => {
        const map = new Map<string, typeof filteredData[0]>();
        filteredData.forEach(item => {
            const dateStr = format(parseDate(item.date), 'yyyy-MM-dd');
            map.set(dateStr, item);
        });
        return map;
    }, [filteredData]);

    return (
        <div className="grid grid-cols-15 grid-rows-2 gap-0">
            {displayDays.map((day, i) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const history = dataMap.get(dateStr);

                if (history) {
                    return <MoodSquare key={history.id} moodDayItem={history} />;
                }
                // Empty placeholder is now rendered in its correct chronological position
                return <EmptySquare key={`empty-${i}`} />;
            })}
        </div>
    )
}