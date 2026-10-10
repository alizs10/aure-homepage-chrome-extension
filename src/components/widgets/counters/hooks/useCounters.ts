import { useMemo } from 'react';
import { useCountersStore } from '../store';
import { useCurrentDateString } from '@/hooks/useCurrentDateString';
import { differenceInDays, parseISO } from 'date-fns';
import type { Counter } from '../types';

export function useCounters() {
    const data = useCountersStore((state) => state.data);
    const loading = useCountersStore((state) => state.loading);
    const filter = useCountersStore((state) => state.filter);

    const addItem = useCountersStore((state) => state.addItem);
    const updateItem = useCountersStore((state) => state.updateItem);
    const removeItem = useCountersStore((state) => state.removeItem);
    const resetItem = useCountersStore((state) => state.resetItem);
    const onFilterChange = useCountersStore((state) => state.onFilterChange);
    const initialize = useCountersStore((state) => state.initialize);

    const todayStr = useCurrentDateString();
    const today = parseISO(todayStr);

    const filteredData = useMemo(() => {
        let filtered = data;
        if (filter === 'count_ups') filtered = data.filter(d => d.type === 'count_up');
        if (filter === 'count_downs') filtered = data.filter(d => d.type === 'count_down');

        // Sort: Count downs by closest to end date, Count ups by longest running
        return filtered.sort((a, b) => {
            if (a.type === 'count_down' && b.type === 'count_down') {
                return parseISO(a.endDate!).getTime() - parseISO(b.endDate!).getTime();
            }
            if (a.type === 'count_up' && b.type === 'count_up') {
                return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
            }
            return 0;
        });
    }, [data, filter]);

    const getDaysCount = (item: Counter) => {
        if (item.type === 'count_up') {
            const start = parseISO(item.startDate);
            return differenceInDays(today, start);
        } else {
            const end = parseISO(item.endDate!);
            return differenceInDays(end, today);
        }
    };

    return {
        data: filteredData,
        loading,
        filter,
        todayStr,
        addItem,
        updateItem,
        removeItem,
        resetItem,
        onFilterChange,
        getDaysCount,
        initialize
    };
}