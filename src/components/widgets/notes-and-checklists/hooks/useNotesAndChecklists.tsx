// hooks/useNotesAndChecklists.ts
import { useMemo } from 'react';
import type { Checklist } from '../types';
import { useNotesAndChecklistsStore } from '../store';

export function useNotesAndChecklists() {
    // Select state slices
    const data = useNotesAndChecklistsStore((state) => state.data);
    const loading = useNotesAndChecklistsStore((state) => state.loading);
    const editable = useNotesAndChecklistsStore((state) => state.editable);

    // Select actions
    const addItem = useNotesAndChecklistsStore((state) => state.addItem);
    const removeItem = useNotesAndChecklistsStore((state) => state.removeItem);
    const toggleCheckbox = useNotesAndChecklistsStore((state) => state.toggleCheckbox);
    const startEdit = useNotesAndChecklistsStore((state) => state.startEdit);
    const updateItem = useNotesAndChecklistsStore((state) => state.updateItem);
    const cancelEdit = useNotesAndChecklistsStore((state) => state.cancelEdit);
    const initialize = useNotesAndChecklistsStore((state) => state.initialize);

    // Compute derived state with useMemo
    const notesCount = useMemo(() => {
        return data.filter(p => !p.content.startsWith("[] ")).length;
    }, [data]);

    const itemsCount = useMemo(() => {
        return data.length - notesCount;
    }, [data, notesCount]);

    const checkedItemsCount = useMemo(() => {
        return data.filter((p) => (p.content.startsWith("[] ") && (p as Checklist).status)).length;
    }, [data]);

    // Return the exact same object shape as the old Context
    return {
        data,
        loading,
        editable,
        addItem,
        removeItem,
        toggleCheckbox,
        startEdit,
        updateItem,
        cancelEdit,
        notesCount,
        itemsCount,
        checkedItemsCount,
        initialize // Exposed so the root component can trigger data loading
    };
}