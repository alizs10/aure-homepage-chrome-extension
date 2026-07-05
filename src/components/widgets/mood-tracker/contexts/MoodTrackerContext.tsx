// contexts/MoodTrackerContext.tsx
import { createContext } from 'react';
import type { filters, MoodHistory, MoodType } from '../types';

interface MoodTrackerContextType {
    data: MoodHistory[];
    today: Date;
    todayMood: MoodHistory | null;
    score: number;
    addItem: (mood: MoodType, date: Date) => void;
    removeItem: (id: number) => void;
    updateItem: (id: number, mood: MoodType) => void;
    filter: typeof filters[number]['value'];
    onFilterChange: (value: typeof filters[number]['value']) => void;
}


const MoodTrackerContext = createContext<MoodTrackerContextType | undefined>(undefined);


export default MoodTrackerContext;