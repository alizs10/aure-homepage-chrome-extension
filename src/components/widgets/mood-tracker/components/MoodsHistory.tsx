import { useMoodTracker } from "../hooks/useMoodTracker";
import { filters, type MoodType } from "../types";
import HistoryList from "./HistoryList";
import { useCallback } from "react";
import { getMoodTextColor } from "../constants/moods";
import Dropdown from "@/components/ui/Dropdown";
import { BetterTypography } from "@/components/common/BetterTypography";
import Score from "./Score";
import MoodsChart from "./MoodsChart";

export default function MoodsHistory() {
    const { todayMood, filter, onFilterChange, showChart } = useMoodTracker();

    const moodTextColor = useCallback(
        (mood: MoodType) => getMoodTextColor(mood, false),
        []
    );

    if (!todayMood) return null;

    const currentFilter = filter || filters[0].value;

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-y-2">
            <div className="flex-center-between">
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
            </div>

            {showChart ? <MoodsChart /> : <HistoryList />}

            <div className="mt-auto flex-row-center gap-x-1">
                <div className="flex-1 app_container px-4 py-1.5 bg-background">
                    <BetterTypography variant="xs">
                        You feel{" "}
                        <BetterTypography
                            as="span"
                            variant="xs"
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