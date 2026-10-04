import { create } from 'zustand';
import type { Progress, ProgressFilter, ProgressLabel } from './types';
import { ProgressLabelRepository, ProgressRepository } from './db';

interface ProgressesState {
    data: Progress[];
    labels: ProgressLabel[];
    loading: boolean;
    filter: ProgressFilter;
    labelFilter: string; // 'all' or label name

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
}

export const useProgressesStore = create<ProgressesState>((set, get) => ({
    data: [],
    labels: [],
    loading: true,
    filter: "all",
    labelFilter: "all",

    initialize: async () => {
        const [progresses, labels] = await Promise.all([
            ProgressRepository.getAll(),
            ProgressLabelRepository.getAll()
        ]);
        set({ data: progresses, labels, loading: false });
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
    },

    removeItem: async (id) => {
        await ProgressRepository.remove(id);
        set((state) => ({ data: state.data.filter(d => d.id !== id) }));
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
    },

    toggleComplete: async (id) => {
        const progress = get().data.find(p => p.id === id);
        if (!progress) return;
        const updated: Progress = { ...progress, completed: !progress.completed, updatedAt: Date.now() };
        await ProgressRepository.put(updated);
        set((state) => ({ data: state.data.map(p => p.id === id ? updated : p) }));
    },

    onFilterChange: (value) => set({ filter: value }),
    onLabelFilterChange: (value) => set({ labelFilter: value }),
}));