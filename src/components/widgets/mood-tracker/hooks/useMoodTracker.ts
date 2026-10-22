// hooks/useMoodTracker.ts
import { useMemo } from 'react';
import { calculateMoodScore } from '../helpers/history';
import { useMoodTrackerStore } from '../store';
import { useCurrentDateString } from '@/hooks/useCurrentDateString';
import { useSettingsStore } from '@/stores';

export function useMoodTracker() {
    // Select only the state slices we need (prevents unnecessary re-renders)
    const data = useMoodTrackerStore((state) => state.data);
    const loading = useMoodTrackerStore((state) => state.loading);
    const filter = useMoodTrackerStore((state) => state.filter);
    const showChart = useMoodTrackerStore((state) => state.showChart); // <-- Added
    const storeSetShowChart = useMoodTrackerStore((state) => state.setShowChart);
    const updateSettings = useSettingsStore((state) => state.update);
    const settings = useSettingsStore((state) => state.settings);

    // Select actions (Zustand actions are stable, so this is highly optimized)
    const addItem = useMoodTrackerStore((state) => state.addItem);
    const removeItem = useMoodTrackerStore((state) => state.removeItem);
    const updateItem = useMoodTrackerStore((state) => state.updateItem);
    const onFilterChange = useMoodTrackerStore((state) => state.onFilterChange);
    const initialize = useMoodTrackerStore((state) => state.initialize);

    const setShowChart = (value: boolean) => {
        storeSetShowChart(value);
        if (settings) {
            updateSettings({
                widgetPreferences: {
                    ...settings.widgetPreferences,
                    'mood-tracker': {
                        ...settings.widgetPreferences?.['mood-tracker'],
                        showChart: value,
                    },
                },
            });
        }
    };


    // 🌟 Reactive date string that auto-updates
    const todayStr = useCurrentDateString();

    const todayMood = useMemo(() => {
        return data.find(item => item.date === todayStr) ?? null;
    }, [data, todayStr]);


    const score = useMemo(() => {
        return calculateMoodScore(data);
    }, [data]);

    return {
        data,
        loading,
        todayStr,
        todayMood,
        showChart,  // <-- Expose this
        setShowChart, // <-- Expose this
        score,
        addItem,
        removeItem,
        updateItem,
        filter,
        onFilterChange,
        initialize // Exposed so the root component can trigger data loading
    };
}