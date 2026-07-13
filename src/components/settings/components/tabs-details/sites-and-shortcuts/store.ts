// stores/favoritesStore.ts
import { create } from 'zustand';
import type { Favorite } from './types';
import { FavoritesRepository } from './db';

interface FavoritesState {
    data: Favorite[];
    loading: boolean;

    // Actions
    initialize: () => Promise<void>;
    addItem: ({ title, url }: Pick<Favorite, "title" | "url">) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (updated: Omit<Favorite, "order">) => Promise<void>;
    sortUp: (id: number) => Promise<void>;
    sortDown: (id: number) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    data: [],
    loading: true,

    // Load data on app start
    initialize: async () => {
        const favorites = await FavoritesRepository.getAll();
        const sorted = favorites.sort((a, b) => a.order - b.order);
        set({ data: sorted, loading: false, });
    },

    addItem: async ({ title, url }) => {
        // Calculate maxOrder on the fly from the latest data
        const currentData = get().data;
        const maxOrder = currentData.reduce((max, f) => Math.max(max, f.order), -1);

        const now = Date.now();
        const favorite: Favorite = {
            id: now,
            title,
            url,
            order: maxOrder + 1
        };

        await FavoritesRepository.put(favorite);
        set((state) => ({ data: [...state.data, favorite] }));
    },

    removeItem: async (id) => {
        await FavoritesRepository.remove(id);
        set((state) => ({ data: state.data.filter((n) => n.id !== id) }));
    },

    updateItem: async (updated) => {
        const favorite = get().data.find((n) => n.id === updated.id);
        if (!favorite) return;

        const updatedFavorite: Favorite = {
            ...favorite,
            ...updated
        };

        await FavoritesRepository.put(updatedFavorite);
        set((state) => ({
            data: state.data.map((n) => (n.id === updated.id ? updatedFavorite : n))
        }));
    },

    sortUp: async (id) => {
        const data = get().data;
        const currentIndex = data.findIndex((item) => item.id === id);
        if (currentIndex <= 0) return;

        const currentItem = data[currentIndex];
        const previousItem = data[currentIndex - 1];

        // Swap orders
        const updatedCurrent = { ...currentItem, order: previousItem.order };
        const updatedPrevious = { ...previousItem, order: currentItem.order };

        await FavoritesRepository.put(updatedCurrent);
        await FavoritesRepository.put(updatedPrevious);

        // Update state and re-sort
        set((state) => {
            const newData = state.data.map((n) => {
                if (n.id === id) return updatedCurrent;
                if (n.id === previousItem.id) return updatedPrevious;
                return n;
            });
            return { data: newData.sort((a, b) => a.order - b.order) };
        });
    },

    sortDown: async (id) => {
        const data = get().data;
        const currentIndex = data.findIndex((item) => item.id === id);
        if (currentIndex === -1 || currentIndex >= data.length - 1) return;

        const currentItem = data[currentIndex];
        const nextItem = data[currentIndex + 1];

        // Swap orders
        const updatedCurrent = { ...currentItem, order: nextItem.order };
        const updatedNext = { ...nextItem, order: currentItem.order };

        await FavoritesRepository.put(updatedCurrent);
        await FavoritesRepository.put(updatedNext);

        // Update state and re-sort
        set((state) => {
            const newData = state.data.map((n) => {
                if (n.id === id) return updatedCurrent;
                if (n.id === nextItem.id) return updatedNext;
                return n;
            });
            return { data: newData.sort((a, b) => a.order - b.order) };
        });
    }
}));