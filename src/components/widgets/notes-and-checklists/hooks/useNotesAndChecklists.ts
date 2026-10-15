// hooks/useNotesAndChecklists.ts
import { useCallback, useMemo } from 'react';
import type { AdvancedNote, Checklist, NoteAndChecklist, TaskBlock } from '../types';
import { useNotesAndChecklistsStore } from '../store';
import { useSettingsStore } from '@/stores';
import { toast } from '@/stores/useToastStore';

export function useNotesAndChecklists() {
    // Select state slices
    const data = useNotesAndChecklistsStore((state) => state.data);
    const loading = useNotesAndChecklistsStore((state) => state.loading);
    const editable = useNotesAndChecklistsStore((state) => state.editable);
    const showChecked = useNotesAndChecklistsStore((state) => state.showChecked);

    // Select actions
    const addItem = useNotesAndChecklistsStore((state) => state.addItem);
    const removeItem = useNotesAndChecklistsStore((state) => state.removeItem);
    const storeToggleCheckbox = useNotesAndChecklistsStore((state) => state.toggleCheckbox);
    const storeToggleAdvancedTask = useNotesAndChecklistsStore((state) => state.toggleAdvancedTask);
    const startEdit = useNotesAndChecklistsStore((state) => state.startEdit);
    const updateItem = useNotesAndChecklistsStore((state) => state.updateItem);
    const cancelEdit = useNotesAndChecklistsStore((state) => state.cancelEdit);
    const storeSetShowChecked = useNotesAndChecklistsStore((state) => state.setShowChecked);
    const initialize = useNotesAndChecklistsStore((state) => state.initialize);
    const cleanup = useNotesAndChecklistsStore((state) => state.cleanup);

    const toggleCheckbox = useCallback(async (id: number) => {
        const item = useNotesAndChecklistsStore.getState().data.find((n) => n.id === id);
        if (item) {
            const isFlatChecklist = ('status' in item && typeof (item as Checklist).status === 'boolean') || item.content.startsWith('[] ') || item.content.startsWith('[x] ');
            if (isFlatChecklist) {
                const currentStatus = typeof (item as Checklist).status === 'boolean'
                    ? (item as Checklist).status
                    : item.content.startsWith('[x] ');
                const status = currentStatus ? 'Unchecked' : 'Checked';
                toast.info(`${status} item`);
            }
        }
        await storeToggleCheckbox(id);
    }, [storeToggleCheckbox]);

    const toggleAdvancedTask = useCallback(async (noteId: number, blockId: string) => {
        const item = useNotesAndChecklistsStore.getState().data.find((n) => n.id === noteId);
        if (item && 'type' in item && item.type === 'advanced') {
            const block = item.blocks.find((b) => b.id === blockId);
            if (block && block.type === 'task') {
                const status = block.status ? 'Unchecked' : 'Checked';
                toast.info(`${status} item`);
            }
        }
        await storeToggleAdvancedTask(noteId, blockId);
    }, [storeToggleAdvancedTask]);

    const updateSettings = useSettingsStore((state) => state.update);
    const settings = useSettingsStore((state) => state.settings);

    const setShowChecked = useCallback((value: boolean) => {
        storeSetShowChecked(value);
        if (settings) {
            updateSettings({
                widgetPreferences: {
                    ...settings.widgetPreferences,
                    'notes-and-checklists': {
                        ...settings.widgetPreferences?.['notes-and-checklists'],
                        showChecked: value,
                    },
                },
            });
        }
    }, [storeSetShowChecked, updateSettings, settings]);

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