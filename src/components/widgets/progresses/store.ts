import { create } from 'zustand';
import type { Progress, ProgressFilter, ProgressLabel, ProgressSort } from './types';
import { ProgressLabelRepository, ProgressRepository } from './db';
import { useSettingsStore } from '@/stores';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const progressesChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('progresses_sync')
    : null;

type ProgressesSyncMessage = {
    type: 'PROGRESSES_SYNC';
    payload: {
        data: Progress[];
        labels: ProgressLabel[];
        sortBy?: ProgressSort;
    };
    tabId: string;
};

function broadcastProgresses() {
    if (progressesChannel) {
        const state = useProgressesStore.getState();
        progressesChannel.postMessage({
            type: 'PROGRESSES_SYNC',
            payload: {
                data: state.data,
                labels: state.labels,
                sortBy: state.sortBy,
            },
            tabId: TAB_ID,
        });
    }
}

if (progressesChannel) {
    progressesChannel.onmessage = (event: MessageEvent<ProgressesSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'PROGRESSES_SYNC') {
            useProgressesStore.setState({
                data: event.data.payload.data,
                labels: event.data.payload.labels,
                ...(event.data.payload.sortBy !== undefined ? { sortBy: event.data.payload.sortBy } : {}),
                loading: false,
            });
        }
    };
}

useSettingsStore.subscribe((state) => {
    const pref = state.settings?.widgetPreferences?.progresses?.sortBy;
    if (pref !== undefined && pref !== useProgressesStore.getState().sortBy) {
        useProgressesStore.setState({ sortBy: pref });
    }
});

interface ProgressesState {
    data: Progress[];
    labels: ProgressLabel[];
    loading: boolean;
    filter: ProgressFilter;
    labelFilter: string; // 'all' or label name
    sortBy: ProgressSort;

    initialize: () => Promise<void>;
    addItem: (item: Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateItem: (id: number, item: Partial<Progress>) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    advanceStep: (id: number) => Promise<void>;
    retreatStep: (id: number) => Promise<void>;
    toggleStep: (id: number, stepId: string) => Promise<void>;
    toggleComplete: (id: number) => Promise<void>;
    onFilterChange: (value: ProgressFilter) => void;
    onLabelFilterChange: (value: string) => void;
    onSortChange: (value: ProgressSort) => void;
}

export const useProgressesStore = create<ProgressesState>((set, get) => ({
    data: [],
    labels: [],
    loading: true,
    filter: "all",
    labelFilter: "all",
    sortBy: "priority-desc",

    initialize: async () => {
        const [progresses, labels] = await Promise.all([
            ProgressRepository.getAll(),
            ProgressLabelRepository.getAll()
        ]);
        const settings = useSettingsStore.getState().settings;
        const sortByPref = settings?.widgetPreferences?.progresses?.sortBy ?? 'priority-desc';
        set({ data: progresses, labels, sortBy: sortByPref, loading: false });
    },

    addItem: async (item) => {
        if (item.label) {
            const existingLabel = await ProgressLabelRepository.getByName(item.label);
            if (!existingLabel) {
                const newLabel: ProgressLabel = { id: Date.now(), name: item.label };
                await ProgressLabelRepository.put(newLabel);
                set((state) => ({ labels: [...state.labels, newLabel] }));
            }
        }

        const now = Date.now();
        const newItem: Progress = { ...item, id: now, createdAt: now, updatedAt: now };
        await ProgressRepository.put(newItem);
        set((state) => ({ data: [...state.data, newItem] }));
        broadcastProgresses();
    },

    updateItem: async (id, updates) => {
        const item = get().data.find(d => d.id === id);
        if (!item) return;

        if (updates.label && updates.label !== item.label) {
            const existingLabel = await ProgressLabelRepository.getByName(updates.label);
            if (!existingLabel) {
                const newLabel: ProgressLabel = { id: Date.now(), name: updates.label };
                await ProgressLabelRepository.put(newLabel);
                set((state) => ({ labels: [...state.labels, newLabel] }));
            }
        }

        const updated: Progress = { ...item, ...updates, updatedAt: Date.now() };
        await ProgressRepository.put(updated);
        set((state) => ({ data: state.data.map(d => d.id === id ? updated : d) }));
        broadcastProgresses();
    },

    removeItem: async (id) => {
        await ProgressRepository.remove(id);
        set((state) => ({ data: state.data.filter(d => d.id !== id) }));
        broadcastProgresses();
    },

    advanceStep: async (id) => {
        const progress = get().data.find(p => p.id === id);
        if (!progress) return;

        const updatedSteps = [...progress.steps];
        let newActiveIndex = progress.activeStepIndex;
        let newCompleted = progress.completed;

        // 🌟 Next button logic: Complete current step and move forward
        if (newActiveIndex < updatedSteps.length) {
            updatedSteps[newActiveIndex] = { ...updatedSteps[newActiveIndex], completed: true };
            newActiveIndex += 1;
            if (newActiveIndex === updatedSteps.length) {
                newCompleted = true; // Reached the end
            }
        }

        const updated: Progress = { ...progress, steps: updatedSteps, activeStepIndex: newActiveIndex, completed: newCompleted, updatedAt: Date.now() };
        await ProgressRepository.put(updated);
        set((state) => ({ data: state.data.map(p => p.id === id ? updated : p) }));
        broadcastProgresses();
    },

    retreatStep: async (id) => {
        const progress = get().data.find(p => p.id === id);
        if (!progress) return;

        const updatedSteps = [...progress.steps];
        let newActiveIndex = progress.activeStepIndex;
        let newCompleted = progress.completed;

        // 🌟 Prev button logic: Move back and uncomplete the previous step
        if (newActiveIndex > 0) {
            newActiveIndex -= 1;
            updatedSteps[newActiveIndex] = { ...updatedSteps[newActiveIndex], completed: false };
            newCompleted = false;
        }

        const updated: Progress = { ...progress, steps: updatedSteps, activeStepIndex: newActiveIndex, completed: newCompleted, updatedAt: Date.now() };
        await ProgressRepository.put(updated);
        set((state) => ({ data: state.data.map(p => p.id === id ? updated : p) }));
        broadcastProgresses();
    },

    toggleStep: async (id, stepId) => {
        const progress = get().data.find(p => p.id === id);
        if (!progress) return;

        const updatedSteps = progress.steps.map(step =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        const allCompleted = updatedSteps.length > 0 && updatedSteps.every(s => s.completed);

        const updated: Progress = { ...progress, steps: updatedSteps, completed: allCompleted, updatedAt: Date.now() };
        await ProgressRepository.put(updated);
        set((state) => ({ data: state.data.map(p => p.id === id ? updated : p) }));
        broadcastProgresses();
    },

    toggleComplete: async (id) => {
        const progress = get().data.find(p => p.id === id);
        if (!progress) return;
        const updated: Progress = { ...progress, completed: !progress.completed, updatedAt: Date.now() };
        await ProgressRepository.put(updated);
        set((state) => ({ data: state.data.map(p => p.id === id ? updated : p) }));
        broadcastProgresses();
    },

    onFilterChange: (value) => set({ filter: value }),
    onLabelFilterChange: (value) => set({ labelFilter: value }),
    onSortChange: (value) => {
        set({ sortBy: value });
        broadcastProgresses();
    },
}));