import { Typography } from '@/components/common/Typography';
import { useMoodTracker } from '../hooks/useMoodTracker';
import { filters, type MoodType } from '../types';
import HistoryList from './HistoryList';
import { useCallback } from 'react';
import { getMoodTextColor } from '../constants/moods';
import Dropdown from '@/components/ui/Dropdown';

export default function MoodsHistory() {
    const { todayMood, filter, onFilterChange } = useMoodTracker();

    const moodTextColor = useCallback(
        (mood: MoodType) => getMoodTextColor(mood, false),
        []
    );

    if (!todayMood) return null;

    // Safely fallback to the first filter's value if `filter` is undefined
    const currentFilter = filter || filters[0].value;

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-y-2">
            <div className="flex-center-between">
                <Typography variant="body-sm" weight="medium">
                    Your Mood history
                </Typography>

                <Dropdown
                    value={currentFilter}
                    options={filters}
                    onValueChange={(newValue) => {
                        onFilterChange(newValue);
                    }}
                />
            </div>

            <HistoryList />

            <div className="mt-auto app_container px-4 py-1.5 bg-background">
                <Typography variant="caption-xs">
                    You feel{' '}
                    <Typography
                        className={`${moodTextColor(todayMood.mood)} capitalize`}
                        variant="caption-xs"
                        weight="semibold"
                    >
                        {todayMood.mood}
                    </Typography>{' '}
                    today!!!
                </Typography>
            </div>
        </div>
    );
}