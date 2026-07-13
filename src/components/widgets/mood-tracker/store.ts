// stores.ts
import { create } from 'zustand';
import { format } from 'date-fns';
import type { filters, MoodHistory, MoodType } from './types';
import { MoodRepository } from './db';

interface MoodTrackerState {
    data: MoodHistory[];
    loading: boolean;
    filter: typeof filters[number]['value'];
    today: Date;

    // Actions
    initialize: () => Promise<void>;
    addItem: (mood: MoodType, date: Date) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (id: number, mood: MoodType) => Promise<void>;
    onFilterChange: (value: typeof filters[number]['value']) => void;
}

export const useMoodTrackerStore = create<MoodTrackerState>((set, get) => ({
    data: [],
    loading: true,
    filter: "last30days",
    today: new Date(), // Created once when the store initializes

    // Load data on app start (replaces the useEffect in the Provider)
    initialize: async () => {
        const moods = await MoodRepository.getAll();
        set({ data: moods, loading: false });
    },

    addItem: async (mood, date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        const now = Date.now();

        const newItem: MoodHistory = {
            id: now, // Using `now` for consistency
            mood,
            date: formattedDate,
            createdAt: now,
            updatedAt: now
        };

        await MoodRepository.put(newItem);

        // Update state immutably
        set((state) => ({ data: [...state.data, newItem] }));
    },

    removeItem: async (id) => {
        await MoodRepository.remove(id);
        set((state) => ({ data: state.data.filter(p => p.id !== id) }));
    },

    updateItem: async (id, mood) => {
        // Use get() to read current state inside an action
        const item = get().data.find((d) => d.id === id);
        if (!item) return;

        const updated: MoodHistory = {
            ...item,
            mood,
            updatedAt: Date.now(),
        };

        await MoodRepository.put(updated);

        set((state) => ({
            data: state.data.map((d) => (d.id === id ? updated : d))
        }));
    },

    onFilterChange: (value) => {
        set({ filter: value });
    }
}));