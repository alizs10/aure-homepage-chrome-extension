import { create } from 'zustand';
import type { Counter, CounterFilter } from './types';
import { CounterRepository } from './db';
import { addDays, format } from 'date-fns';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const countersChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('counters_sync')
    : null;

type CountersSyncMessage = {
    type: 'COUNTERS_SYNC';
    payload: Counter[];
    tabId: string;
};

function broadcastCounters(data: Counter[]) {
    if (countersChannel) {
        countersChannel.postMessage({
            type: 'COUNTERS_SYNC',
            payload: data,
            tabId: TAB_ID,
        });
    }
}

if (countersChannel) {
    countersChannel.onmessage = (event: MessageEvent<CountersSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'COUNTERS_SYNC') {
            useCountersStore.setState({
                data: event.data.payload,
                loading: false,
            });
        }
    };
}

interface CountersState {
    data: Counter[];
    loading: boolean;
    filter: CounterFilter;

    initialize: () => Promise<void>;
    addItem: (item: Omit<Counter, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateItem: (id: number, item: Partial<Counter>) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    resetItem: (id: number) => Promise<void>;
    onFilterChange: (value: CounterFilter) => void;
}

export const useCountersStore = create<CountersState>((set, get) => ({
    data: [],
    loading: true,
    filter: "all",

    initialize: async () => {
        const counters = await CounterRepository.getAll();
        set({ data: counters, loading: false });
    },

    addItem: async (item) => {
        const now = Date.now();
        const newItem: Counter = {
            ...item,
            id: now,
            createdAt: now,
            updatedAt: now,
        };
        await CounterRepository.put(newItem);
        set((state) => ({ data: [...state.data, newItem] }));
        broadcastCounters(get().data);
    },

    updateItem: async (id, updates) => {
        const item = get().data.find(d => d.id === id);
        if (!item) return;

        const updated: Counter = {
            ...item,
            ...updates,
            updatedAt: Date.now(),
        };
        await CounterRepository.put(updated);
        set((state) => ({
            data: state.data.map(d => d.id === id ? updated : d)
        }));
        broadcastCounters(get().data);
    },

    removeItem: async (id) => {
        await CounterRepository.remove(id);
        set((state) => ({ data: state.data.filter(d => d.id !== id) }));
        broadcastCounters(get().data);
    },

    resetItem: async (id) => {
        const item = get().data.find(d => d.id === id);
        if (!item) return;

        const now = new Date();
        const updated: Counter = { ...item, updatedAt: now.getTime() };

        if (item.type === 'count_up') {
            updated.startDate = format(now, 'yyyy-MM-dd');
        } else if (item.type === 'count_down' && item.isRecurring && item.intervalDays) {
            // Push end date forward by intervalDays from today
            updated.endDate = format(addDays(now, item.intervalDays), 'yyyy-MM-dd');
            // 🌟 Reset the progress bar by updating createdAt to now
            updated.createdAt = now.getTime();
        }

        await CounterRepository.put(updated);
        set((state) => ({
            data: state.data.map(d => d.id === id ? updated : d)
        }));
        broadcastCounters(get().data);
    },

    onFilterChange: (value) => {
        set({ filter: value });
    }
}));