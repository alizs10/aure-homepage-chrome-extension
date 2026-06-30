// contexts/useCalendar.ts
import { useContext } from 'react';
import CalendarContext from '../contexts/CalendarContext';

export function useCalendar() {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
}