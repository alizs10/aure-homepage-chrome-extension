import { useFavoritesStore } from '../stores/favorites.store';

export function useFavorites() {
    const data = useFavoritesStore((state) => state.data);
    const loading = useFavoritesStore((state) => state.loading);

    const addItem = useFavoritesStore((state) => state.addItem);
    const removeItem = useFavoritesStore((state) => state.removeItem);
    const updateItem = useFavoritesStore((state) => state.updateItem);
    const sortUp = useFavoritesStore((state) => state.sortUp);
    const sortDown = useFavoritesStore((state) => state.sortDown);
    const initialize = useFavoritesStore((state) => state.initialize);

    return {
        data,
        loading,
        addItem,
        removeItem,
        updateItem,
        sortUp,
        sortDown,
        initialize,
    };
}
