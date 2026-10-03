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

    // 🌟 Type guards for safe type narrowing
    const isAdvanced = (item: NoteAndChecklist): item is AdvancedNote =>
        'type' in item && item.type === 'advanced';

    const isChecklist = useCallback((item: NoteAndChecklist): item is Checklist =>
        'status' in item && !isAdvanced(item), []);

    // 🌟 Compute derived stats
    const stats = useMemo(() => {
        let notesCount = 0;
        let itemsCount = 0;
        let checkedItemsCount = 0;

        data.forEach(item => {
            if (isAdvanced(item)) {
                const tasks = item.blocks.filter(b => b.type === 'task') as TaskBlock[];
                if (tasks.length > 0) {
                    // Advanced notes with tasks count towards task stats
                    itemsCount += tasks.length;
                    checkedItemsCount += tasks.filter(t => t.status).length;
                } else {
                    // Pure text advanced notes count as notes
                    notesCount++;
                }
            } else if (isChecklist(item)) {
                itemsCount++;
                if (item.status) checkedItemsCount++;
            } else {
                notesCount++;
            }
        });

        return { notesCount, itemsCount, checkedItemsCount };
    }, [data, isChecklist]);

    // 🌟 Filtered data based on the showChecked setting
    const filteredData = useMemo(() => {
        if (showChecked) return data;

        return data.filter(item => {
            if (isChecklist(item)) {
                return !item.status; // Hide checked flat checklists
            }
            if (isAdvanced(item)) {
                const tasks = item.blocks.filter(b => b.type === 'task') as TaskBlock[];
                if (tasks.length === 0) return true; // Show if no tasks

                // Hide entire note if ALL tasks are completed
                const allChecked = tasks.every(t => t.status);
                return !allChecked;
            }
            return true; // Show flat notes
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
        notesCount: stats.notesCount,
        itemsCount: stats.itemsCount,
        checkedItemsCount: stats.checkedItemsCount,
        initialize
    };
}