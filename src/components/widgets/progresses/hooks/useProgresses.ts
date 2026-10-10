import { useMemo } from 'react';
import { useProgressesStore } from '../store';
import { isBefore, parseISO } from 'date-fns';

export function useProgresses() {
    const data = useProgressesStore((state) => state.data);
    const labels = useProgressesStore((state) => state.labels);
    const loading = useProgressesStore((state) => state.loading);
    const filter = useProgressesStore((state) => state.filter);
    const labelFilter = useProgressesStore((state) => state.labelFilter);

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

    const filteredData = useMemo(() => {
        let filtered = data;

        // Status Filter
        if (filter === 'undone') filtered = filtered.filter(d => !d.completed);
        if (filter === 'done') filtered = filtered.filter(d => d.completed);

        // 🌟 Label Filter
        if (labelFilter !== 'all') {
            filtered = filtered.filter(d => d.label === labelFilter);
        }

        // Sort: Overdue first, then by priority (high > medium > low), then by creation date
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const now = new Date();

        return filtered.sort((a, b) => {
            const aOverdue = a.deadline && !a.completed && isBefore(parseISO(a.deadline), now) ? 1 : 0;
            const bOverdue = b.deadline && !b.completed && isBefore(parseISO(b.deadline), now) ? 1 : 0;
            if (aOverdue !== bOverdue) return bOverdue - aOverdue;

            if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
                return priorityWeight[b.priority] - priorityWeight[a.priority];
            }
            return a.createdAt - b.createdAt;
        });
    }, [data, filter, labelFilter]);

    return {
        data: filteredData,
        labels,
        loading,
        filter,
        labelFilter,
        addItem,
        updateItem,
        removeItem,
        advanceStep,
        retreatStep,
        toggleStep,
        toggleComplete,
        onFilterChange,
        onLabelFilterChange,
        initialize
    };
}