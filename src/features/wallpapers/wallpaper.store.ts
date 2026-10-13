import { create } from "zustand";
import type { Wallpaper } from "@/types";
import { wallpaperRepository } from "./wallpaper.repo";
import defaultDark1 from "@/assets/background/default-dark.webp";
import defaultLight from "@/assets/background/default-light.webp";

export const DEFAULT_WALLPAPERS: Wallpaper[] = [
    { id: "default", name: "Default", variants: { light: defaultLight, dark: defaultDark1 } }
];

export interface WallpaperState {
    customWallpapers: Wallpaper[];
    loading: boolean;
    fetchWallpapers: () => Promise<void>;
    addWallpaper: (wallpaper: Wallpaper) => Promise<string>;
    deleteWallpaper: (id: string) => Promise<void>;
    getWallpaper: (id: string) => Promise<Wallpaper | null>;
}

export const useWallpaperStore = create<WallpaperState>((set, get) => ({
    customWallpapers: [],
    loading: false,

    fetchWallpapers: async () => {
        set({ loading: true });
        try {
            const wallpapers = await wallpaperRepository.getAll();
            set({ customWallpapers: wallpapers, loading: false });
        } catch (error) {
            console.error("Failed to fetch wallpapers", error);
            set({ loading: false });
        }
    },

    addWallpaper: async (data: Wallpaper) => {
        const id = await wallpaperRepository.add(data);
        await get().fetchWallpapers();
        return id;
    },

    deleteWallpaper: async (id: string) => {
        await wallpaperRepository.delete(id);
        await get().fetchWallpapers();
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
