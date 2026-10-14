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
        return id;
    },

    deleteWallpaper: async (id: string) => {
        await wallpaperRepository.delete(id);
        await get().fetchWallpapers(true);
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
