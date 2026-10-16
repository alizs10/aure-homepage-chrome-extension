import { create } from "zustand";
import browser from "webextension-polyfill";
import { storage } from "../lib/storage";
import type { Settings } from "../types";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { db } from "@/lib/db";

// 🌟 Cross-Tab Sync Setup
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

const settingsChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('settings_sync')
    : null;

type SettingsSyncMessage =
    | { type: 'SETTINGS_UPDATE'; payload: Settings; tabId: string }
    | { type: 'SETTINGS_CLEAR'; tabId: string };

function broadcastSettings(settings: Settings) {
    if (settingsChannel) {
        settingsChannel.postMessage({
            type: 'SETTINGS_UPDATE',
            payload: settings,
            tabId: TAB_ID,
        });
    }
}

function broadcastClear() {
    if (settingsChannel) {
        settingsChannel.postMessage({
            type: 'SETTINGS_CLEAR',
            tabId: TAB_ID,
        });
    }
}

if (settingsChannel) {
    settingsChannel.onmessage = (event: MessageEvent<SettingsSyncMessage>) => {
        if (!event.data || event.data.tabId === TAB_ID) return;

        if (event.data.type === 'SETTINGS_UPDATE') {
            // Update store silently (no storage save, no broadcast)
            useSettingsStore.setState({ settings: event.data.payload, loading: false });
        } else if (event.data.type === 'SETTINGS_CLEAR') {
            useSettingsStore.setState({ settings: null });
        }
    };
}

// 🌟 Fallback listener for changes from browser/chrome storage directly
const storageApi = typeof browser !== 'undefined' && browser.storage ? browser.storage : (typeof chrome !== 'undefined' ? chrome.storage : null);
if (storageApi?.onChanged) {
    storageApi.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.settings) {
            const next = changes.settings.newValue as Settings | undefined;
            if (next) {
                const current = useSettingsStore.getState().settings;
                if (JSON.stringify(current) !== JSON.stringify(next)) {
                    useSettingsStore.setState({ settings: next, loading: false });
                }
            } else if (changes.settings.oldValue && !next) {
                useSettingsStore.setState({ settings: null });
            }
        }
    });
}

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
        broadcastSettings(settings);
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
        broadcastSettings(next);
    },

    clear: async () => {
        // 1. Clear known settings keys
        await Promise.all(
            Object.values(STORAGE_KEYS).map((key) => storage.remove(key))
        );

        // 2. Clear IndexedDB
        await Promise.all(db.tables.map((table) => table.clear()));

        set({ settings: null });
        broadcastClear();
    },
}));