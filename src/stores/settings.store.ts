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

    // Inside your useSettingsStore clear method:
    clear: async () => {
        // 1. Clear known settings keys
        await Promise.all(
            Object.values(STORAGE_KEYS).map((key) => storage.remove(key))
        );

        // 2. (Optional) Clear all dynamic favicon caches
        const allStorage = await chrome.storage.local.get(null); // Gets everything
        const faviconKeys = Object.keys(allStorage).filter((key) =>
            key.startsWith("favicon_")
        );

        if (faviconKeys.length > 0) {
            await chrome.storage.local.remove(faviconKeys);
        }

        // 3. Clear IndexedDB
        await Promise.all(db.tables.map((table) => table.clear()));

        set({ settings: null });
    },
}));