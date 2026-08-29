import { create } from 'zustand';
import type { Folder, Website } from '../../types';
import { FoldersRepository } from './db';

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
        const data = get().data;
        const currentIndex = data.findIndex((item) => item.id === id);
        if (currentIndex <= 0) return;
        const currentItem = data[currentIndex];
        const previousItem = data[currentIndex - 1];
        const updatedCurrent = { ...currentItem, order: previousItem.order };
        const updatedPrevious = { ...previousItem, order: currentItem.order };
        await FoldersRepository.put(updatedCurrent);
        await FoldersRepository.put(updatedPrevious);
        set((state) => ({
            data: state.data.map((n) => {
                if (n.id === id) return updatedCurrent;
                if (n.id === previousItem.id) return updatedPrevious;
                return n;
            }).sort((a, b) => a.order - b.order)
        }));
    },

    sortDown: async (id) => {
        const data = get().data;
        const currentIndex = data.findIndex((item) => item.id === id);
        if (currentIndex === -1 || currentIndex >= data.length - 1) return;
        const currentItem = data[currentIndex];
        const nextItem = data[currentIndex + 1];
        const updatedCurrent = { ...currentItem, order: nextItem.order };
        const updatedNext = { ...nextItem, order: currentItem.order };
        await FoldersRepository.put(updatedCurrent);
        await FoldersRepository.put(updatedNext);
        set((state) => ({
            data: state.data.map((n) => {
                if (n.id === id) return updatedCurrent;
                if (n.id === nextItem.id) return updatedNext;
                return n;
            }).sort((a, b) => a.order - b.order)
        }));
    },

    addWebsiteToFolder: async (folderId, websiteData) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;
        const newWebsite: Website = { id: Date.now(), ...websiteData, order: folder.websites.length };
        const updatedFolder = { ...folder, websites: [...folder.websites, newWebsite] };
        await FoldersRepository.put(updatedFolder);
        set((state) => ({ data: state.data.map((n) => (n.id === folderId ? updatedFolder : n)) }));
    },

    removeWebsiteFromFolder: async (folderId, websiteId) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;
        const updatedFolder = { ...folder, websites: folder.websites.filter((w) => w.id !== websiteId) };
        await FoldersRepository.put(updatedFolder);
        set((state) => ({ data: state.data.map((n) => (n.id === folderId ? updatedFolder : n)) }));
    },

    updateWebsiteInFolder: async (folderId, websiteId, updatedData) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;

        const updatedWebsites = folder.websites.map((w) =>
            w.id === websiteId ? { ...w, ...updatedData } : w
        );

        await FoldersRepository.put({ ...folder, websites: updatedWebsites });
        set((state) => ({
            data: state.data.map((n) => (n.id === folderId ? { ...n, websites: updatedWebsites } : n))
        }));
    },

    sortWebsiteUp: async (folderId, websiteId) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;
        const websites = folder.websites;
        const currentIndex = websites.findIndex((w) => w.id === websiteId);
        if (currentIndex <= 0) return;

        const currentItem = websites[currentIndex];
        const previousItem = websites[currentIndex - 1];
        const updatedCurrent = { ...currentItem, order: previousItem.order };
        const updatedPrevious = { ...previousItem, order: currentItem.order };

        const updatedWebsites = websites.map((w) => {
            if (w.id === websiteId) return updatedCurrent;
            if (w.id === previousItem.id) return updatedPrevious;
            return w;
        }).sort((a, b) => a.order - b.order);

        await FoldersRepository.put({ ...folder, websites: updatedWebsites });
        set((state) => ({
            data: state.data.map((n) => (n.id === folderId ? { ...n, websites: updatedWebsites } : n))
        }));
    },

    sortWebsiteDown: async (folderId, websiteId) => {
        const folder = get().data.find((f) => f.id === folderId);
        if (!folder) return;
        const websites = folder.websites;
        const currentIndex = websites.findIndex((w) => w.id === websiteId);
        if (currentIndex === -1 || currentIndex >= websites.length - 1) return;

        const currentItem = websites[currentIndex];
        const nextItem = websites[currentIndex + 1];
        const updatedCurrent = { ...currentItem, order: nextItem.order };
        const updatedNext = { ...nextItem, order: currentItem.order };

        const updatedWebsites = websites.map((w) => {
            if (w.id === websiteId) return updatedCurrent;
            if (w.id === nextItem.id) return updatedNext;
            return w;
        }).sort((a, b) => a.order - b.order);

        await FoldersRepository.put({ ...folder, websites: updatedWebsites });
        set((state) => ({
            data: state.data.map((n) => (n.id === folderId ? { ...n, websites: updatedWebsites } : n))
        }));
    }
}));