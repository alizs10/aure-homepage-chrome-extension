// hooks/useFavorites.ts
import { useFavoritesStore } from '../store';

export function useFavorites() {
    // Select state slices
    const data = useFavoritesStore((state) => state.data);
    const loading = useFavoritesStore((state) => state.loading);

    // Select actions
    const addItem = useFavoritesStore((state) => state.addItem);
    const removeItem = useFavoritesStore((state) => state.removeItem);
    const updateItem = useFavoritesStore((state) => state.updateItem);
    const sortUp = useFavoritesStore((state) => state.sortUp);
    const sortDown = useFavoritesStore((state) => state.sortDown);
    const initialize = useFavoritesStore((state) => state.initialize);

    // Return the exact same object shape as the old Context
    return {
        data,
        loading,
        addItem,
        removeItem,
        updateItem,
        sortUp,
        sortDown,
        initialize // Exposed so the root component can trigger data loading
    };
}