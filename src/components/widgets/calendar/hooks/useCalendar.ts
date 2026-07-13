// hooks/useCalendar.ts
import { useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { useCalendarNotesStore } from '../store';

export function useCalendar() {
    // Select state slices
    const data = useCalendarNotesStore((state) => state.data);
    const loading = useCalendarNotesStore((state) => state.loading);
    const today = useCalendarNotesStore((state) => state.today);
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

    // Compute derived state with useMemo
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