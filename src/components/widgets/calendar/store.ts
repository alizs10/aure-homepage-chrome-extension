// stores.ts
import { create } from 'zustand';
import { format } from 'date-fns';
import type { CalendarNote } from './types';
import { CalendarRepository } from './db';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const calendarChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('calendar_sync')
    : null;

type CalendarSyncMessage = {
    type: 'CALENDAR_SYNC';
    payload: CalendarNote[];
    tabId: string;
};

function broadcastCalendar(data: CalendarNote[]) {
    if (calendarChannel) {
        calendarChannel.postMessage({
            type: 'CALENDAR_SYNC',
            payload: data,
            tabId: TAB_ID,
        });
    }
}

if (calendarChannel) {
    calendarChannel.onmessage = (event: MessageEvent<CalendarSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'CALENDAR_SYNC') {
            useCalendarNotesStore.setState({
                data: event.data.payload,
                loading: false,
            });
        }
    };
}

interface CalendarNotesState {
    data: CalendarNote[];
    loading: boolean;
    month: Date;
    selectedDay: undefined | Date;

    // Actions
    initialize: () => Promise<void>;
    selectMonth: (value: Date | undefined) => void;
    selectSelectedDay: (value: Date | undefined) => void;
    addItem: (note: string, date: Date) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (id: number, note: string) => Promise<void>;
    getNoteForDay: (date: Date) => CalendarNote | undefined;
}

export const useCalendarNotesStore = create<CalendarNotesState>((set, get) => ({
    data: [],
    loading: true,
    month: new Date(),
    selectedDay: undefined, // Initialized to today

    // Load data on app start (replaces the useEffect in the Provider)
    initialize: async () => {
        const notes = await CalendarRepository.getAll();
        set({ data: notes, loading: false });
    },

    selectMonth: (value) => {
        if (!value) return;
        set({ month: value });
    },

    selectSelectedDay: (value) => {
        if (!value) return;
        set({ selectedDay: value });
    },

    // Synchronous helper to find a note
    getNoteForDay: (date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        return get().data.find(d => d.date === formattedDate);
    },

    addItem: async (text, date) => {
        const formattedDate = format(date, "yyyy-MM-dd");

        // Check if a note already exists for this day
        const existing = await CalendarRepository.getByDate(formattedDate);
        if (existing) return;

        const now = Date.now();
        const note: CalendarNote = {
            id: now,
            text,
            date: formattedDate,
            createdAt: now,
            updatedAt: now,
        };

        await CalendarRepository.put(note);
        set((state) => ({ data: [...state.data, note] }));
        broadcastCalendar(get().data);
    },

    removeItem: async (id) => {
        await CalendarRepository.remove(id);
        set((state) => ({ data: state.data.filter((n) => n.id !== id) }));
        broadcastCalendar(get().data);
    },

    updateItem: async (id, text) => {
        // Use get() to read current state inside an action
        const note = get().data.find((n) => n.id === id);
        if (!note) return;

        const updated: CalendarNote = {
            ...note,
            text,
            updatedAt: Date.now(),
        };

        await CalendarRepository.put(updated);

        set((state) => ({
            data: state.data.map((n) => (n.id === id ? updated : n))
        }));
        broadcastCalendar(get().data);
    }
}));