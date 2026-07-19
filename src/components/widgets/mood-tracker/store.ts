// stores.ts
import { create } from 'zustand';
import { format } from 'date-fns';
import type { filters, MoodHistory, MoodType } from './types';
import { MoodRepository } from './db';
import { useSettingsStore } from '@/stores';

interface MoodTrackerState {
    data: MoodHistory[];
    loading: boolean;
    filter: typeof filters[number]['value'];
    showChart: boolean, // Default to true


    // Actions
    initialize: () => Promise<void>;
    addItem: (mood: MoodType, date: Date) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (id: number, mood: MoodType) => Promise<void>;
    getItemByDate: (date: Date) => Promise<MoodHistory | undefined>;
    getItem: (id: number) => Promise<MoodHistory | undefined>;
    onFilterChange: (value: typeof filters[number]['value']) => void;
    setShowChart: (value: boolean) => void; // <-- Added
}

export const useMoodTrackerStore = create<MoodTrackerState>((set, get) => ({
    data: [],
    loading: true,
    filter: "last30days",
    showChart: false, // Default to true



    // Load data on app start (replaces the useEffect in the Provider)
    initialize: async () => {
        const moods = await MoodRepository.getAll();

        // Read the preference from the global settings store
        const settings = useSettingsStore.getState().settings;
        const savedShowChart = settings?.widgetPreferences?.['mood-tracker']?.showChart;

        set({
            data: moods,
            loading: false,
            showChart: savedShowChart !== undefined ? savedShowChart : true
        });

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


    getItemByDate: async (date: Date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        return get().data.find((d) => d.date === formattedDate);
    },
    getItem: async (id: number) => {
        return get().data.find((d) => d.id === id);
    },



    updateItem: async (id, mood) => {
        // Use get() to read current state inside an action
        const item = await get().getItem(id)
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
    },

    setShowChart: async (value) => {
        // 1. Optimistic UI: Update local store immediately for zero-lag feel
        set({ showChart: value });

        // 2. Persist to Global Settings: Use the existing `update` method
        const settings = useSettingsStore.getState().settings;
        if (!settings) return;

        await useSettingsStore.getState().update({
            widgetPreferences: {
                ...settings.widgetPreferences,
                'mood-tracker': {
                    ...settings.widgetPreferences?.['mood-tracker'],
                    showChart: value,
                },
            },
        });
    }
}));