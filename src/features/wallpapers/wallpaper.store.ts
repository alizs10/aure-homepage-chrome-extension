import { create } from "zustand";
import type { Wallpaper } from "@/types";
import { wallpaperRepository } from "./wallpaper.repo";
import defaultDark1 from "@/assets/background/default-dark.webp";
import defaultLight from "@/assets/background/default-light.webp";

export const DEFAULT_WALLPAPERS: Wallpaper[] = [
    { id: "default", name: "Default", variants: { light: defaultLight, dark: defaultDark1 } }
];

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const wallpaperChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('wallpaper_sync')
    : null;

type WallpaperSyncMessage = {
    type: 'WALLPAPERS_SYNC';
    payload: Wallpaper[];
    tabId: string;
};

function broadcastWallpapers(customWallpapers: Wallpaper[]) {
    if (wallpaperChannel) {
        wallpaperChannel.postMessage({
            type: 'WALLPAPERS_SYNC',
            payload: customWallpapers,
            tabId: TAB_ID,
        });
    }
}

if (wallpaperChannel) {
    wallpaperChannel.onmessage = (event: MessageEvent<WallpaperSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'WALLPAPERS_SYNC') {
            useWallpaperStore.setState({
                customWallpapers: event.data.payload,
                loading: false,
                initialized: true,
            });
        }
    };
}

export interface WallpaperState {
    customWallpapers: Wallpaper[];
    loading: boolean;
    initialized: boolean;
    fetchWallpapers: (force?: boolean) => Promise<void>;
    addWallpaper: (wallpaper: Wallpaper) => Promise<string>;
    deleteWallpaper: (id: string) => Promise<void>;
    getWallpaper: (id: string) => Promise<Wallpaper | null>;
}

export const useWallpaperStore = create<WallpaperState>((set, get) => ({
    customWallpapers: [],
    loading: false,
    initialized: false,

    fetchWallpapers: async (force = false) => {
        if (get().initialized && !force) {
            return;
        }

        if (!get().initialized) {
            set({ loading: true });
        }

        try {
            const wallpapers = await wallpaperRepository.getAll();
            set({ customWallpapers: wallpapers, loading: false, initialized: true });
        } catch (error) {
            console.error("Failed to fetch wallpapers", error);
            set({ loading: false, initialized: true });
        }
    },

    addWallpaper: async (data: Wallpaper) => {
        const id = await wallpaperRepository.add(data);
        await get().fetchWallpapers(true);
        broadcastWallpapers(get().customWallpapers);
        return id;
    },

    deleteWallpaper: async (id: string) => {
        await wallpaperRepository.delete(id);
        await get().fetchWallpapers(true);
        broadcastWallpapers(get().customWallpapers);
    },

    getWallpaper: async (id: string) => {
        if (!id || id === "default") {
            return DEFAULT_WALLPAPERS[0];
        }
        const found = get().customWallpapers.find((w) => w.id === id);
        if (found) return found;
        const fromDb = await wallpaperRepository.getById(id);
        return fromDb ?? null;
    },
}));
