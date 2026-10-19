// stores.ts
import { create } from 'zustand';
import { format } from 'date-fns';
import type { filters, MoodHistory, MoodType } from './types';
import { MoodRepository } from './db';
import { useSettingsStore } from '@/stores';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const moodChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('mood_sync')
    : null;

type MoodSyncMessage = {
    type: 'MOOD_SYNC';
    payload: {
        data: MoodHistory[];
        showChart?: boolean;
    };
    tabId: string;
};

function broadcastMood() {
    if (moodChannel) {
        const state = useMoodTrackerStore.getState();
        moodChannel.postMessage({
            type: 'MOOD_SYNC',
            payload: {
                data: state.data,
                showChart: state.showChart,
            },
            tabId: TAB_ID,
        });
    }
}

if (moodChannel) {
    moodChannel.onmessage = (event: MessageEvent<MoodSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'MOOD_SYNC') {
            useMoodTrackerStore.setState({
                data: event.data.payload.data,
                ...(event.data.payload.showChart !== undefined ? { showChart: event.data.payload.showChart } : {}),
                loading: false,
            });
        }
    };
}

useSettingsStore.subscribe((state) => {
    const pref = state.settings?.widgetPreferences?.['mood-tracker']?.showChart;
    if (pref !== undefined && pref !== useMoodTrackerStore.getState().showChart) {
        useMoodTrackerStore.setState({ showChart: pref });
    }
});

interface MoodTrackerState {
    data: MoodHistory[];
    loading: boolean;
    filter: typeof filters[number]['value'];
    showChart: boolean;

    // Actions
    initialize: () => Promise<void>;
    addItem: (mood: MoodType, date: Date | string) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (id: number, mood: MoodType) => Promise<void>;
    getItemByDate: (date: Date | string) => Promise<MoodHistory | undefined>;
    getItem: (id: number) => Promise<MoodHistory | undefined>;
    onFilterChange: (value: typeof filters[number]['value']) => void;
    setShowChart: (value: boolean) => void;
}

export const useMoodTrackerStore = create<MoodTrackerState>((set, get) => ({
    data: [],
    loading: true,
    filter: "last30days",
    showChart: false,

    initialize: async () => {
        const moods = await MoodRepository.getAll();
        const settings = useSettingsStore.getState().settings;
        const showChartPref = settings?.widgetPreferences?.['mood-tracker']?.showChart ?? false;
        set({
            data: moods,
            showChart: showChartPref,
            loading: false,
        });
    },

    addItem: async (mood, date) => {
        const formattedDate = typeof date === 'string' ? date : format(date, "yyyy-MM-dd");
        const existing = get().data.find((d) => d.date === formattedDate);

        if (existing) {
            await get().updateItem(existing.id, mood);
            return;
        }

        const now = Date.now();
        const newItem: MoodHistory = {
            id: now,
            mood,
            date: formattedDate,
            createdAt: now,
            updatedAt: now
        };

        await MoodRepository.put(newItem);

        // Update state immutably
        set((state) => ({ data: [...state.data, newItem] }));
        broadcastMood();
    },

    removeItem: async (id) => {
        await MoodRepository.remove(id);
        set((state) => ({ data: state.data.filter(p => p.id !== id) }));
        broadcastMood();
    },

    getItemByDate: async (date: Date | string) => {
        const formattedDate = typeof date === 'string' ? date : format(date, "yyyy-MM-dd");
        return get().data.find((d) => d.date === formattedDate);
    },

    getItem: async (id: number) => {
        return get().data.find((d) => d.id === id);
    },

    updateItem: async (id, mood) => {
        const item = await get().getItem(id);
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
        broadcastMood();
    },

    onFilterChange: (value) => {
        set({ filter: value });
    },

    setShowChart: (value) => {
        set({ showChart: value });
        broadcastMood();
    }
}));