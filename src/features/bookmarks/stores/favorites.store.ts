import { create } from 'zustand';
import type { Favorite } from '../types';
import { FavoritesRepository } from '../db/favorites.repo';
import { getAdjacentSwap } from '@/lib/util';

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
        set({ data: sorted, loading: false });
    },

    addItem: async ({ title, url }) => {
        const currentData = get().data;
        const maxOrder = currentData.reduce((max, f) => Math.max(max, f.order), -1);

        const now = Date.now();
        const favorite: Favorite = {
            id: now,
            title,
            url,
            order: maxOrder + 1,
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
            ...updated,
        };

        await FavoritesRepository.put(updatedFavorite);
        set((state) => ({
            data: state.data.map((n) => (n.id === updated.id ? updatedFavorite : n)),
        }));
    },

    sortUp: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'up');
        if (!swap) return;

        await FavoritesRepository.put(swap.updatedCurrent);
        await FavoritesRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
    },

    sortDown: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'down');
        if (!swap) return;

        await FavoritesRepository.put(swap.updatedCurrent);
        await FavoritesRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
    },
}));
