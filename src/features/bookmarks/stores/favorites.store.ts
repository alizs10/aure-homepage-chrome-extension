import { create } from 'zustand';
import type { Favorite } from '../types';
import { FavoritesRepository } from '../db/favorites.repo';
import { getAdjacentSwap } from '@/lib/util';

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const favoritesChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('favorites_sync')
    : null;

type FavoritesSyncMessage = {
    type: 'FAVORITES_SYNC';
    payload: Favorite[];
    tabId: string;
};

function broadcastFavorites(data: Favorite[]) {
    if (favoritesChannel) {
        favoritesChannel.postMessage({
            type: 'FAVORITES_SYNC',
            payload: data,
            tabId: TAB_ID,
        });
    }
}

if (favoritesChannel) {
    favoritesChannel.onmessage = (event: MessageEvent<FavoritesSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'FAVORITES_SYNC') {
            useFavoritesStore.setState({ data: event.data.payload, loading: false });
        }
    };
}

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
        broadcastFavorites(get().data);
    },

    removeItem: async (id) => {
        await FavoritesRepository.remove(id);
        set((state) => ({ data: state.data.filter((n) => n.id !== id) }));
        broadcastFavorites(get().data);
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
        broadcastFavorites(get().data);
    },

    sortUp: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'up');
        if (!swap) return;

        await FavoritesRepository.put(swap.updatedCurrent);
        await FavoritesRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
        broadcastFavorites(get().data);
    },

    sortDown: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'down');
        if (!swap) return;

        await FavoritesRepository.put(swap.updatedCurrent);
        await FavoritesRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
        broadcastFavorites(get().data);
    },
}));
