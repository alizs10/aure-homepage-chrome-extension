// hooks/useCalendar.ts
import { useMemo } from 'react';
import { isSameDay, parseISO } from 'date-fns';
import { useCalendarNotesStore } from '../store';
import { useCurrentDateString } from '@/hooks/useCurrentDateString';

export function useCalendar() {
    // Select state slices
    const data = useCalendarNotesStore((state) => state.data);
    const loading = useCalendarNotesStore((state) => state.loading);
    const month = useCalendarNotesStore((state) => state.month);
    const selectedDay = useCalendarNotesStore((state) => state.selectedDay);

    // Select actions
    const selectMonth = useCalendarNotesStore((state) => state.selectMonth);
    const selectSelectedDay = useCalendarNotesStore((state) => state.selectSelectedDay);
    const addItem = useCalendarNotesStore((state) => state.addItem);
    const removeItem = useCalendarNotesStore((state) => state.removeItem);
    const updateItem = useCalendarNotesStore((state) => state.updateItem);
    const getNoteForDay = useCalendarNotesStore((state) => state.getNoteForDay);
    const initialize = useCalendarNotesStore((state) => state.initialize);

    // 🌟 1. Get the reactive, auto-updating date string
    const todayStr = useCurrentDateString();

    // 🌟 2. Convert it to a Date object for date-fns compatibility
    // This is memoized, so it only creates a new Date object when the day actually changes
    const today = useMemo(() => parseISO(todayStr), [todayStr]);

    // 🌟 3. Now `isTodaySelected` will automatically recalculate when `today` rolls over
    const isTodaySelected = useMemo(() => {
        return selectedDay ? isSameDay(selectedDay, today) : undefined;
    }, [selectedDay, today]);

    // Return the exact same object shape as the old Context
    return {
        data,
        loading,
        today,
        month,
        selectMonth,
        selectedDay,
        selectSelectedDay,
        isTodaySelected,
        addItem,
        removeItem,
        updateItem,
        getNoteForDay,
        initialize // Exposed so the root component can trigger data loading
    };
}