import { useMemo } from "react";
import { useMoodTracker } from "../hooks/useMoodTracker";
import { filterHistoryByRange } from "../helpers/history";
import MoodSquare from "./MoodSquare";
import EmptySquare from "./EmptySquare";

export default function HistoryDaysList() {
    const { data, filter } = useMoodTracker()

    const filteredData = useMemo(() => {

        return filterHistoryByRange(data, filter);

    }, [data, filter]);


    const allBlocks = filter === 'thisWeek' ? 7 : 30;

    const emptyBlocks = allBlocks - filteredData.length;


    return (
        <div className="grid grid-cols-15 grid-rows-2 gap-0">
            {filteredData?.map(history => (
                <MoodSquare key={history.id} moodDayItem={history} />
            ))}
            {Array.from({ length: emptyBlocks }).map((_, i) => (
                <EmptySquare key={i} />
            ))}
        </div>
    )
}
