import { create } from 'zustand';
import type { Folder, Website } from '../types';
import { FoldersRepository } from '../db/folders.repo';
import { getAdjacentSwap } from '@/lib/util';

interface FoldersState {
    data: Folder[];
    loading: boolean;

    initialize: () => Promise<void>;
    addItem: ({ title }: Pick<Folder, "title">) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    updateItem: (updated: Omit<Folder, "order">) => Promise<void>;
    sortUp: (id: number) => Promise<void>;
    sortDown: (id: number) => Promise<void>;

    addWebsiteToFolder: (folderId: number, websiteData: Omit<Website, "id" | "order">) => Promise<void>;
    removeWebsiteFromFolder: (folderId: number, websiteId: number) => Promise<void>;
    updateWebsiteInFolder: (folderId: number, websiteId: number, updatedData: Partial<Website>) => Promise<void>;

    sortWebsiteUp: (folderId: number, websiteId: number) => Promise<void>;
    sortWebsiteDown: (folderId: number, websiteId: number) => Promise<void>;
}

export const useFoldersStore = create<FoldersState>((set, get) => ({
    data: [],
    loading: true,

    initialize: async () => {
        const folders = await FoldersRepository.getAll();
        const sorted = folders.sort((a, b) => a.order - b.order);
        set({ data: sorted, loading: false });
    },

    addItem: async ({ title }) => {
        const currentData = get().data;
        const maxOrder = currentData.reduce((max, f) => Math.max(max, f.order), -1);
        const folder: Folder = { id: Date.now(), title, websites: [], order: maxOrder + 1 };
        await FoldersRepository.put(folder);
        set((state) => ({ data: [...state.data, folder] }));
    },

    removeItem: async (id) => {
        await FoldersRepository.remove(id);
        set((state) => ({ data: state.data.filter((n) => n.id !== id) }));
    },

    updateItem: async (updated) => {
        const folder = get().data.find((n) => n.id === updated.id);
        if (!folder) return;
        const updatedFolder = { ...folder, ...updated };
        await FoldersRepository.put(updatedFolder);
        set((state) => ({ data: state.data.map((n) => (n.id === updated.id ? updatedFolder : n)) }));
    },

    sortUp: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'up');
        if (!swap) return;

        await FoldersRepository.put(swap.updatedCurrent);
        await FoldersRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
    },

    sortDown: async (id) => {
        const swap = getAdjacentSwap(get().data, id, 'down');
        if (!swap) return;

        await FoldersRepository.put(swap.updatedCurrent);
        await FoldersRepository.put(swap.updatedAdjacent);
        set({ data: swap.newItems });
    },

    addWebsiteToFolder: async (folderId, websiteData) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;

        const maxOrder = folder.websites.reduce((max, w) => Math.max(max, w.order), -1);
        const newWebsite: Website = { id: Date.now(), ...websiteData, order: maxOrder + 1 };

        const updatedFolder: Folder = {
            ...folder,
            websites: [...folder.websites, newWebsite]
        };

        await FoldersRepository.put(updatedFolder);
        set((state) => ({
            data: state.data.map((f) => (f.id === folderId ? updatedFolder : f))
        }));
    },

    removeWebsiteFromFolder: async (folderId, websiteId) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;

        const updatedFolder: Folder = {
            ...folder,
            websites: folder.websites.filter((w) => w.id !== websiteId)
        };

        await FoldersRepository.put(updatedFolder);
        set((state) => ({
            data: state.data.map((f) => (f.id === folderId ? updatedFolder : f))
        }));
    },

    updateWebsiteInFolder: async (folderId, websiteId, updatedData) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;

        const website = folder.websites.find((w) => w.id === websiteId);
        if (!website) return;

        const updatedWebsite: Website = {
            ...website,
            ...updatedData
        };

        const updatedFolder: Folder = {
            ...folder,
            websites: folder.websites.map((w) => (w.id === websiteId ? updatedWebsite : w))
        };

        await FoldersRepository.put(updatedFolder);
        set((state) => ({
            data: state.data.map((f) => (f.id === folderId ? updatedFolder : f))
        }));
    },

    sortWebsiteUp: async (folderId, websiteId) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;

        const swap = getAdjacentSwap(folder.websites, websiteId, 'up');
        if (!swap) return;

        const updatedFolder: Folder = {
            ...folder,
            websites: swap.newItems,
        };

        await FoldersRepository.put(updatedFolder);
        set((state) => ({
            data: state.data.map((f) => (f.id === folderId ? updatedFolder : f)),
        }));
    },

    sortWebsiteDown: async (folderId, websiteId) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;

        const swap = getAdjacentSwap(folder.websites, websiteId, 'down');
        if (!swap) return;

        const updatedFolder: Folder = {
            ...folder,
            websites: swap.newItems,
        };

        await FoldersRepository.put(updatedFolder);
        set((state) => ({
            data: state.data.map((f) => (f.id === folderId ? updatedFolder : f)),
        }));
    }
}));
