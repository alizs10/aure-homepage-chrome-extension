// hooks/useFavorites.ts
import { useMemo } from 'react';
import { useFavoritesStore } from '../store';

export function useFavorites() {
    // Select state slices
    const data = useFavoritesStore((state) => state.data);

    // Select actions
    const addItem = useFavoritesStore((state) => state.addItem);
    const removeItem = useFavoritesStore((state) => state.removeItem);
    const updateItem = useFavoritesStore((state) => state.updateItem);
    const sortUp = useFavoritesStore((state) => state.sortUp);
    const sortDown = useFavoritesStore((state) => state.sortDown);
    const initialize = useFavoritesStore((state) => state.initialize);

    // Compute derived state with useMemo
    const maxOrder = useMemo(() => {
        return data.reduce((max, f) => Math.max(max, f.order), -1);
    }, [data]);

    // Return the exact same object shape as the old Context
    return {
        data,
        addItem,
        removeItem,
        updateItem,
        sortUp,
        sortDown,
        maxOrder,
        initialize // Exposed so the root component can trigger data loading
    };
}