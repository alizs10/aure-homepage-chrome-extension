import { BetterTypography } from "@/components/common/BetterTypography";
import { useCallback } from "react";
import { getMoodTextColor } from "../constants/moods";
import { useMoodTracker } from "../hooks/useMoodTracker";
import { type MoodType } from "../types";
import HistoryList from "./HistoryList";
import MoodsChart from "./MoodsChart";
import Score from "./Score";

export default function MoodsHistory() {
    const { todayMood, showChart } = useMoodTracker();

    const moodTextColor = useCallback(
        (mood: MoodType) => getMoodTextColor(mood, false),
        []
    );

    if (!todayMood) return null;

    // const currentFilter = filter || filters[0].value;

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-y-4">
            {/* <div className="flex-center-between">
                <BetterTypography
                    variant="sm"
                    weight="medium"
                    className="text-nowrap"
                >
                    Mood history
                </BetterTypography>

                <Dropdown
                    value={currentFilter}
                    options={filters}
                    onValueChange={(newValue) => {
                        onFilterChange(newValue);
                    }}
                />
            </div> */}

            {showChart ? <MoodsChart /> : <HistoryList />}

            <div className="mt-auto flex-row-center gap-x-1">
                <div className="flex-1 rounded-3xl app_shadow px-4 py-1.5 bg-background">
                    <BetterTypography className="text-nowrap" variant="12-12-14-12-14">
                        You feel{" "}
                        <BetterTypography
                            as="span"
                            variant="12-12-14-12-14"
                            weight="semibold"
                            className={`${moodTextColor(todayMood.mood)} capitalize`}
                        >
                            {todayMood.mood}
                        </BetterTypography>{" "}
                        today!!!
                    </BetterTypography>
                </div>

                <Score />
            </div>
        </div>
    );
}