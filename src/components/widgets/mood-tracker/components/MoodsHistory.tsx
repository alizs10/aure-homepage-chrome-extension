import { Typography } from '@/components/common/Typography';
import Dropdown from '@/components/Form/Dropdown';
import { useMoodTracker } from '../hooks/useMoodTracker';
import { filters, type MoodType } from '../types';

import HistoryList from './HistoryList';
import { useCallback } from 'react';
import { getMoodTextColor } from '../constants/moods';

export default function MoodsHistory() {

    const { todayMood, filter, onFilterChange } = useMoodTracker()

    const moodTextColor = useCallback((mood: MoodType) => getMoodTextColor(mood, false), []);

    if (!todayMood) return null;

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-y-2">

            <div className="flex-center-between">

                <Typography variant="body-sm" weight="medium">
                    Your Mood history
                </Typography>

                <Dropdown
                    value={filters.find(f => f.value === filter) || filters[0]}
                    options={filters.map(f => ({ label: f.label, value: f.value }))}
                    onValueChange={(value) => {
                        const filterValue = filters.find(f => f.value === value)?.value;

                        if (filterValue) {
                            onFilterChange(filterValue);
                        }
                    }}
                />

            </div>


            <HistoryList />



            <div className="mt-auto app_container px-4 py-1.5 bg-background">
                <Typography variant="caption-xs">

                    You feel <Typography className={`${moodTextColor(todayMood.mood)} capitalize`} variant="caption-xs" weight="semibold">{todayMood.mood}</Typography> today!!!

                </Typography>
            </div>

        </div>
    )
}
