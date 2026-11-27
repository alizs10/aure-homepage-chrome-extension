import { create } from 'zustand';
import type { Routine, Website } from '../types';
import { RoutinesRepository } from '../db/routines.repo';
import { getAdjacentSwap } from '@/lib/util';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const routinesChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('routines_sync')
    : null;

type RoutinesSyncMessage = {
    type: 'ROUTINES_SYNC';
    payload: Routine[];
    tabId: string;
};

function broadcastRoutines(data: Routine[]) {
    if (routinesChannel) {
        routinesChannel.postMessage({
            type: 'ROUTINES_SYNC',
            payload: data,
            tabId: TAB_ID,
        });
    }
}

if (routinesChannel) {
    routinesChannel.onmessage = (event: MessageEvent<RoutinesSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'ROUTINES_SYNC') {
            useRoutinesStore.setState({ data: event.data.payload, loading: false });
        }
    };
}

export const MAX_ROUTINES = 5;
export const MAX_SITES_PER_ROUTINE = 5;

interface RoutinesState {
    data: Routine[];
    loading: boolean;

    initialize: () => Promise<void>;
    addItem: ({ title }: Pick<Routine, "title">) => Promise<boolean>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (updated: Omit<Routine, "order">) => Promise<void>;
    sortUp: (id: number) => Promise<void>;
    sortDown: (id: number) => Promise<void>;

    addWebsiteToRoutine: (routineId: number, websiteData: Omit<Website, "id" | "order">) => Promise<boolean>;
    removeWebsiteFromRoutine: (routineId: number, websiteId: number) => Promise<void>;
    updateWebsiteInRoutine: (routineId: number, websiteId: number, updatedData: Partial<Website>) => Promise<void>;

    sortWebsiteUp: (routineId: number, websiteId: number) => Promise<void>;
    sortWebsiteDown: (routineId: number, websiteId: number) => Promise<void>;
}

export const useRoutinesStore = create<RoutinesState>((set, get) => ({
    data: [],
    loading: true,

    initialize: async () => {
        const routines = await RoutinesRepository.getAll();
        const sorted = routines.sort((a, b) => a.order - b.order);
        set({ data: sorted, loading: false });
    },

    addItem: async ({ title }) => {
        const currentData = get().data;
        if (currentData.length >= MAX_ROUTINES) {
            return false;
        }

        const maxOrder = currentData.reduce((max, f) => Math.max(max, f.order), -1);
        const routine: Routine = { id: Date.now(), title, websites: [], order: maxOrder + 1 };
        await RoutinesRepository.put(routine);
        set((state) => ({ data: [...state.data, routine] }));
        broadcastRoutines(get().data);
        return true;
    },

    removeItem: async (id) => {
        await RoutinesRepository.remove(id);
        set((state) => ({ data: state.data.filter((n) => n.id !== id) }));
        broadcastRoutines(get().data);
    },

    updateItem: async (updated) => {
        const routine = get().data.find((n) => n.id === updated.id);
        if (!routine) return;
        const updatedRoutine = { ...routine, ...updated };
        await RoutinesRepository.put(updatedRoutine);
        set((state) => ({ data: state.data.map((n) => (n.id === updated.id ? updatedRoutine : n)) }));
        broadcastRoutines(get().data);
    },

    sortUp: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'up');
        if (!swap) return;

        await RoutinesRepository.put(swap.updatedCurrent);
        await RoutinesRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
        broadcastRoutines(swap.newItems);
    },

    sortDown: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'down');
        if (!swap) return;

        await RoutinesRepository.put(swap.updatedCurrent);
        await RoutinesRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
        broadcastRoutines(swap.newItems);
    },

    addWebsiteToRoutine: async (routineId, websiteData) => {
        const routine = get().data.find((f) => f.id === routineId);
        if (!routine) return false;

        if (routine.websites.length >= MAX_SITES_PER_ROUTINE) {
            return false;
        }

        const currentSites = routine.websites || [];
        const maxOrder = currentSites.reduce((max, s) => Math.max(max, s.order), -1);
        const newWebsite: Website = {
            id: Date.now(),
            order: maxOrder + 1,
            ...websiteData,
        };

        const updatedRoutine: Routine = {
            ...routine,
            websites: [...currentSites, newWebsite],
        };

        await RoutinesRepository.put(updatedRoutine);
        set((state) => ({
            data: state.data.map((f) => (f.id === routineId ? updatedRoutine : f)),
        }));
        broadcastRoutines(get().data);
        return true;
    },

    removeWebsiteFromRoutine: async (routineId, websiteId) => {
        const routine = get().data.find((f) => f.id === routineId);
        if (!routine) return;

        const updatedSites = routine.websites.filter((s) => s.id !== websiteId);
        const updatedRoutine: Routine = {
            ...routine,
            websites: updatedSites,
        };

        await RoutinesRepository.put(updatedRoutine);
        set((state) => ({
            data: state.data.map((f) => (f.id === routineId ? updatedRoutine : f)),
        }));
        broadcastRoutines(get().data);
    },

    updateWebsiteInRoutine: async (routineId, websiteId, updatedData) => {
        const routine = get().data.find((f) => f.id === routineId);
        if (!routine) return;

        const updatedSites = routine.websites.map((s) =>
            s.id === websiteId ? { ...s, ...updatedData } : s
        );

        const updatedRoutine: Routine = {
            ...routine,
            websites: updatedSites,
        };

        await RoutinesRepository.put(updatedRoutine);
        set((state) => ({
            data: state.data.map((f) => (f.id === routineId ? updatedRoutine : f)),
        }));
        broadcastRoutines(get().data);
    },

    sortWebsiteUp: async (routineId, websiteId) => {
        const routine = get().data.find((f) => f.id === routineId);
        if (!routine) return;

        const swap = getAdjacentSwap(routine.websites, websiteId, 'up');
        if (!swap) return;

        const updatedRoutine: Routine = {
            ...routine,
            websites: swap.newItems,
        };

        await RoutinesRepository.put(updatedRoutine);
        set((state) => ({
            data: state.data.map((f) => (f.id === routineId ? updatedRoutine : f)),
        }));
        broadcastRoutines(get().data);
    },

    sortWebsiteDown: async (routineId, websiteId) => {
        const routine = get().data.find((f) => f.id === routineId);
        if (!routine) return;

        const swap = getAdjacentSwap(routine.websites, websiteId, 'down');
        if (!swap) return;

        const updatedRoutine: Routine = {
            ...routine,
            websites: swap.newItems,
        };

        await RoutinesRepository.put(updatedRoutine);
        set((state) => ({
            data: state.data.map((f) => (f.id === routineId ? updatedRoutine : f)),
        }));
        broadcastRoutines(get().data);
    },
}));
