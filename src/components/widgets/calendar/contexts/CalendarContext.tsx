// contexts/CalendarNotesContext.tsx
import { createContext } from 'react';
import type { CalendarNote } from '../types';

interface CalendarContextType {
    data: CalendarNote[];
    today: Date;
    month: Date;
    selectMonth: (value: Date | undefined) => void;
    selectedDay: Date | undefined;
    selectSelectedDay: (value: Date | undefined) => void;
    isTodaySelected: boolean | undefined;
    addItem: (note: string, date: Date) => void;
    removeItem: (id: number) => void;
    updateItem: (id: number, note: string) => void;
    getNoteForDay: (date: Date) => CalendarNote | undefined;
}


const CalendarContext = createContext<CalendarContextType | undefined>(undefined);


export default CalendarContext;