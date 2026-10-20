import { useCallback, useMemo } from 'react';
import { useProgressesStore } from '../store';
import { isBefore, parseISO } from 'date-fns';
import { useSettingsStore } from '@/stores';
import type { ProgressSort } from '../types';

export function useProgresses() {
    const data = useProgressesStore((state) => state.data);
    const labels = useProgressesStore((state) => state.labels);
    const loading = useProgressesStore((state) => state.loading);
    const filter = useProgressesStore((state) => state.filter);
    const labelFilter = useProgressesStore((state) => state.labelFilter);
    const sortBy = useProgressesStore((state) => state.sortBy);
    const storeOnSortChange = useProgressesStore((state) => state.onSortChange);
    const updateSettings = useSettingsStore((state) => state.update);
    const settings = useSettingsStore((state) => state.settings);

    const addItem = useProgressesStore((state) => state.addItem);
    const updateItem = useProgressesStore((state) => state.updateItem);
    const removeItem = useProgressesStore((state) => state.removeItem);
    const advanceStep = useProgressesStore((state) => state.advanceStep);
    const retreatStep = useProgressesStore((state) => state.retreatStep);
    const toggleStep = useProgressesStore((state) => state.toggleStep);
    const toggleComplete = useProgressesStore((state) => state.toggleComplete);
    const onFilterChange = useProgressesStore((state) => state.onFilterChange);
    const onLabelFilterChange = useProgressesStore((state) => state.onLabelFilterChange);
    const initialize = useProgressesStore((state) => state.initialize);

    const onSortChange = useCallback((value: ProgressSort) => {
        storeOnSortChange(value);
        const currentSettings = settings ?? useSettingsStore.getState().settings;
        if (currentSettings) {
            updateSettings({
                widgetPreferences: {
                    ...currentSettings.widgetPreferences,
                    progresses: {
                        ...currentSettings.widgetPreferences?.progresses,
                        sortBy: value,
                    },
                },
            });
        }
    }, [storeOnSortChange, updateSettings, settings]);

    const filteredData = useMemo(() => {
        let filtered = data;

        // Status Filter
        if (filter === 'undone') filtered = filtered.filter(d => !d.completed);
        if (filter === 'done') filtered = filtered.filter(d => d.completed);

        // 🌟 Label Filter
        if (labelFilter !== 'all') {
            filtered = filtered.filter(d => d.label === labelFilter);
        }

        // Sort: Overdue first, then by user-selected sort option
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const now = new Date();

        return [...filtered].sort((a, b) => {
            const aOverdue = a.deadline && !a.completed && isBefore(parseISO(a.deadline), now) ? 1 : 0;
            const bOverdue = b.deadline && !b.completed && isBefore(parseISO(b.deadline), now) ? 1 : 0;
            if (aOverdue !== bOverdue) return bOverdue - aOverdue;

            switch (sortBy) {
                case 'priority-desc': {
                    const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
                    if (diff !== 0) return diff;
                    return b.createdAt - a.createdAt;
                }
                case 'priority-asc': {
                    const diff = priorityWeight[a.priority] - priorityWeight[b.priority];
                    if (diff !== 0) return diff;
                    return b.createdAt - a.createdAt;
                }
                case 'created-desc': {
                    const diff = b.createdAt - a.createdAt;
                    if (diff !== 0) return diff;
                    return priorityWeight[b.priority] - priorityWeight[a.priority];
                }
                case 'created-asc': {
                    const diff = a.createdAt - b.createdAt;
                    if (diff !== 0) return diff;
                    return priorityWeight[b.priority] - priorityWeight[a.priority];
                }
                default:
                    return 0;
            }
        });
    }, [data, filter, labelFilter, sortBy]);

    return {
        data: filteredData,
        labels,
        loading,
        filter,
        labelFilter,
        sortBy,
        addItem,
        updateItem,
        removeItem,
        advanceStep,
        retreatStep,
        toggleStep,
        toggleComplete,
        onFilterChange,
        onLabelFilterChange,
        onSortChange,
        initialize
    };
}