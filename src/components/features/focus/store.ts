import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storage_keys';
import { storage } from '@/lib/storage'; // Adjust path to your storage utility
import { toast } from 'sonner';

// 🌟 1. Define the exact shape of the data stored in Chrome Storage
type SavedFocusTimer = {
    isRunning: boolean;
    isStarted: boolean;
    startedAt: number | null;
    elapsed: number;
};

// 🌟 2. The store state includes the data shape + the action methods
type FocusTimerState = SavedFocusTimer & {
    initialize: () => Promise<void>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    reset: () => Promise<void>;
};

export const useFocusTimerStore = create<FocusTimerState>((set, get) => ({
    isRunning: false,
    isStarted: false,
    startedAt: null,
    elapsed: 0,

    initialize: async () => {
        // 🌟 3. Replace `any` with the strict `SavedFocusTimer` type
        const saved = await storage.get<SavedFocusTimer>(STORAGE_KEYS.focus);

        if (saved) {
            if (saved.isRunning && saved.startedAt) {
                const now = Date.now();
                set({
                    ...saved,
                    elapsed: saved.elapsed + (now - saved.startedAt),
                    startedAt: now,
                });
            } else {
                set(saved);
            }
        }
    },

    start: async () => {
        const current = get();
        const updated: SavedFocusTimer = {
            ...current,
            isRunning: true,
            isStarted: true,
            startedAt: Date.now(),
        };
        set(updated);
        await storage.set(STORAGE_KEYS.focus, updated);
        toast.success(current.isStarted ? "Focus session resumed." : "Focus session started.");
    },

    stop: async () => {
        const current = get();
        if (!current.isRunning) {
            toast.info("Focus timer is not currently running.");
            return;
        }
        const now = Date.now();
        const updated: SavedFocusTimer = {
            ...current,
            isRunning: false,
            startedAt: null,
            elapsed: current.elapsed + (now - (current.startedAt ?? now)),
        };
        set(updated);
        await storage.set(STORAGE_KEYS.focus, updated);
        toast.info("Focus session paused.");
    },

    reset: async () => {
        const initial: SavedFocusTimer = {
            isRunning: false,
            isStarted: false,
            startedAt: null,
            elapsed: 0,
        };
        set(initial);
        await storage.remove(STORAGE_KEYS.focus);
        toast.info("Focus timer has been reset.");
    },
}));