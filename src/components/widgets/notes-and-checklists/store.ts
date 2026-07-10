// stores.ts
import { create } from 'zustand';
import { toast } from 'sonner';
import type { Checklist, NoteAndChecklist } from './types';
import { NotesRepository } from './db';

interface NotesAndChecklistsState {
    data: NoteAndChecklist[];
    editable: NoteAndChecklist | undefined;

    // Actions
    initialize: () => Promise<void>;
    addItem: (content: string) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    toggleCheckbox: (id: number) => Promise<void>;
    startEdit: (id: number) => void;
    updateItem: (content: string) => Promise<void>;
    cancelEdit: () => void;
}

export const useNotesAndChecklistsStore = create<NotesAndChecklistsState>((set, get) => ({
    data: [],
    editable: undefined,

    // Load data on app start
    initialize: async () => {
        const notes = await NotesRepository.getAll();
        set({ data: notes });
    },

    addItem: async (content) => {
        const now = Date.now();
        const note: NoteAndChecklist = {
            id: now,
            content,
            createdAt: now,
            updatedAt: now,
            status: false,
        };

        await NotesRepository.put(note);
        set((state) => ({ data: [...state.data, note] }));
    },

    removeItem: async (id) => {
        await NotesRepository.remove(id);

        // Cleanly update both data and editable in a single set() call
        set((state) => ({
            data: state.data.filter((n) => n.id !== id),
            editable: state.editable?.id === id ? undefined : state.editable
        }));
    },

    toggleCheckbox: async (id) => {
        const note = get().data.find((n) => n.id === id);
        if (!note) return;

        const status = (note as Checklist).status ? 'Unchecked' : 'Checked';
        toast.info(`${status} item`);

        const updated: NoteAndChecklist = {
            ...note,
            status: !(note as Checklist).status,
            updatedAt: Date.now(),
        };

        await NotesRepository.put(updated);
        set((state) => ({
            data: state.data.map((n) => (n.id === id ? updated : n))
        }));
    },

    startEdit: (id) => {
        const note = get().data.find((n) => n.id === id);
        if (note) {
            set({ editable: { ...note } });
        }
    },

    updateItem: async (content) => {
        const { editable } = get();
        if (!editable) return;

        const updated: NoteAndChecklist = {
            ...editable,
            content,
            updatedAt: Date.now(),
        };

        await NotesRepository.put(updated);

        // Update the data array and clear the editable state in one go
        set((state) => ({
            data: state.data.map((n) => (n.id === editable.id ? updated : n)),
            editable: undefined
        }));
    },

    cancelEdit: () => {
        set({ editable: undefined });
    }
}));