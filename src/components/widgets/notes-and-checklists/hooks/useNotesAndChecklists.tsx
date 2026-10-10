// hooks/useNotesAndChecklists.ts
import { useCallback, useMemo } from 'react';
import type { AdvancedNote, Checklist, NoteAndChecklist, TaskBlock } from '../types';
import { useNotesAndChecklistsStore } from '../store';

export function useNotesAndChecklists() {
    // Select state slices
    const data = useNotesAndChecklistsStore((state) => state.data);
    const loading = useNotesAndChecklistsStore((state) => state.loading);
    const editable = useNotesAndChecklistsStore((state) => state.editable);
    const showChecked = useNotesAndChecklistsStore((state) => state.showChecked);

    // Select actions
    const addItem = useNotesAndChecklistsStore((state) => state.addItem);
    const removeItem = useNotesAndChecklistsStore((state) => state.removeItem);
    const toggleCheckbox = useNotesAndChecklistsStore((state) => state.toggleCheckbox);
    const toggleAdvancedTask = useNotesAndChecklistsStore((state) => state.toggleAdvancedTask);
    const startEdit = useNotesAndChecklistsStore((state) => state.startEdit);
    const updateItem = useNotesAndChecklistsStore((state) => state.updateItem);
    const cancelEdit = useNotesAndChecklistsStore((state) => state.cancelEdit);
    const setShowChecked = useNotesAndChecklistsStore((state) => state.setShowChecked);
    const initialize = useNotesAndChecklistsStore((state) => state.initialize);
    const cleanup = useNotesAndChecklistsStore((state) => state.cleanup);

    // 🌟 Type guards for safe type narrowing
    const isAdvanced = (item: NoteAndChecklist): item is AdvancedNote =>
        'type' in item && item.type === 'advanced';

    const isChecklist = useCallback((item: NoteAndChecklist): item is Checklist => {
        if (isAdvanced(item)) return false;
        return item.content.startsWith('[] ') || item.content.startsWith('[x] ');
    }, []);

    // 🌟 Compute derived stats
    const stats = useMemo(() => {
        let notesCount = 0;
        let itemsCount = 0;
        let checkedItemsCount = 0;

        data.forEach(item => {
            if (isAdvanced(item)) {
                const tasks = item.blocks.filter(b => b.type === 'task') as TaskBlock[];
                const hasText = item.blocks.some(b => b.type === 'text');

                if (hasText) notesCount++;

                itemsCount += tasks.length;
                checkedItemsCount += tasks.filter(t => t.status).length;
            } else if (isChecklist(item)) {
                itemsCount++;
                const isChecked = item.content.startsWith('[x] ') || ('status' in item && (item as Checklist).status === true);
                if (isChecked) checkedItemsCount++;
            } else {
                notesCount++;
            }
        });

        return { notesCount, itemsCount, checkedItemsCount };
    }, [data, isChecklist]);

    // 🌟 Compute counts for the cleanup modal (Synced perfectly with Stats)
    const cleanupCounts = useMemo(() => {
        let completed = 0;
        let tasks = 0;
        let notes = 0;
        const all = data.length;

        data.forEach(item => {
            if (isAdvanced(item)) {
                const taskBlocks = item.blocks.filter(b => b.type === 'task') as TaskBlock[];
                const hasText = item.blocks.some(b => b.type === 'text');

                // Tasks count = number of task blocks (matches stats)
                tasks += taskBlocks.length;
                completed += taskBlocks.filter(t => t.status).length;

                // 🌟 FIX: Notes count = 1 if it has ANY text blocks (matches stats)
                if (hasText) notes += 1;
            } else if (isChecklist(item)) {
                tasks += 1;
                const isChecked = item.content.startsWith('[x] ') || ('status' in item && (item as Checklist).status === true);
                if (isChecked) completed += 1;
            } else {
                // Flat note = 1 document with text (matches stats)
                notes += 1;
            }
        });

        return { completed, tasks, notes, all };
    }, [data, isChecklist]);

    // 🌟 Filtered data based on the showChecked setting
    const filteredData = useMemo(() => {
        if (showChecked) return data;

        return data.filter(item => {
            if (isChecklist(item)) {
                const isChecked = item.content.startsWith('[x] ') || ('status' in item && (item as Checklist).status === true);
                return !isChecked;
            }
            if (isAdvanced(item)) {
                const tasks = item.blocks.filter(b => b.type === 'task') as TaskBlock[];
                if (tasks.length === 0) return true;

                const allChecked = tasks.every(t => t.status);
                return !allChecked;
            }
            return true;
        });
    }, [data, showChecked, isChecklist]);

    return {
        data,
        filteredData,
        loading,
        editable,
        showChecked,
        setShowChecked,
        addItem,
        removeItem,
        toggleCheckbox,
        toggleAdvancedTask,
        startEdit,
        updateItem,
        cancelEdit,
        cleanup,
        cleanupCounts,
        notesCount: stats.notesCount,
        itemsCount: stats.itemsCount,
        checkedItemsCount: stats.checkedItemsCount,
        initialize
    };
}