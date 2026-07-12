import { create } from "zustand";
import { storage } from "../lib/storage";
import type { Settings } from "../types";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { db } from "@/lib/db";

type SettingsStore = {
    settings: Settings | null;
    loading: boolean;

    load: () => Promise<void>;
    save: (settings: Settings) => Promise<void>;
    update: (updates: Partial<Settings>) => Promise<void>;
    clear: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: null,
    loading: true,

    load: async () => {
        const settings = await storage.get<Settings>("settings");

        set({
            settings,
            loading: false,
        });
    },

    save: async (settings) => {
        await storage.set("settings", settings);

        set({ settings });
    },

    update: async (updates) => {
        const current = get().settings;

        if (!current) return;

        const next = {
            ...current,
            ...updates,
        };

        await storage.set("settings", next);

        set({
            settings: next,
        });
    },

    clear: async () => {
        // Clear all local storage / chrome storage keys
        await Promise.all(
            Object.values(STORAGE_KEYS).map((key) =>
                storage.remove(key)
            )
        );

        // 🚀 UPDATED: Dexie uses db.delete() to wipe the IndexedDB database
        await db.delete();

        set({
            settings: null,
        });
    },
}));