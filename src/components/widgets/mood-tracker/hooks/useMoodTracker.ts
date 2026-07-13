// hooks/useMoodTracker.ts
import { useMemo } from 'react';
import { format } from 'date-fns';
import { calculateMoodScore } from '../helpers/history';
import { useMoodTrackerStore } from '../store';

export function useMoodTracker() {
    // Select only the state slices we need (prevents unnecessary re-renders)
    const data = useMoodTrackerStore((state) => state.data);
    const loading = useMoodTrackerStore((state) => state.loading);
    const filter = useMoodTrackerStore((state) => state.filter);
    const today = useMoodTrackerStore((state) => state.today);

    // Select actions (Zustand actions are stable, so this is highly optimized)
    const addItem = useMoodTrackerStore((state) => state.addItem);
    const removeItem = useMoodTrackerStore((state) => state.removeItem);
    const updateItem = useMoodTrackerStore((state) => state.updateItem);
    const onFilterChange = useMoodTrackerStore((state) => state.onFilterChange);
    const initialize = useMoodTrackerStore((state) => state.initialize);

    // Compute derived state with useMemo, exactly like the old Provider
    const todayMood = useMemo(() => {
        const formattedToday = format(today, "yyyy-MM-dd");
        return data.find(item => item.date === formattedToday) ?? null;
    }, [data, today]);

    const score = useMemo(() => {
        return calculateMoodScore(data);
    }, [data]);

    return {
        data,
        loading,
        today,
        todayMood,
        score,
        addItem,
        removeItem,
        updateItem,
        filter,
        onFilterChange,
        initialize // Exposed so the root component can trigger data loading
    };
}