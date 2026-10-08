import { db } from "@/lib/db";
import { storage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/storage_keys";

// ✅ Import types for strict casting during import
import type { Favorite, Folder } from '@/components/settings/components/tabs-details/sites-and-folders/types';
import type { CalendarNote } from '@/components/widgets/calendar/types';
import type { MoodHistory } from '@/components/widgets/mood-tracker/types';
import type { NoteAndChecklist } from '@/components/widgets/notes-and-checklists/types';
import type { Pet } from '@/components/widgets/pet-house/types';
import type { PomodoroHistoryEntry, PomodoroTask, PomodoroActiveState } from '@/components/widgets/pomodoro/types';
import type { Wallpaper } from '@/types';
import { CURRENT_SCHEMA_VERSION } from "./migrations";
import type { Counter } from "@/components/widgets/counters/types";
import type { Progress, ProgressLabel } from '@/components/widgets/progresses/types';

async function getAllChromeStorageData() {
    const data: Record<string, unknown> = {};
    const keys = Object.values(STORAGE_KEYS);

    for (const key of keys) {
        const value = await storage.get<unknown>(key);
        if (value !== undefined && value !== null) {
            data[key] = value;
        }
    }
    return data;
}

// ✅ RESTORED: Safely wipe all data before restoring for a clean import
async function clearAllData() {
    await db.transaction('rw',
        [
            db.wallpapers, db.moods, db.pets, db.calendar,
            db.notes, db.favorites, db.folders, db.counters,
            db.pomodoroHistory, db.pomodoroTasks, db.pomodoroActiveState,
            db.progresses, db.progressLabels
        ],
        async () => {
            await db.wallpapers.clear();
            await db.moods.clear();
            await db.pets.clear();
            await db.calendar.clear();
            await db.notes.clear();
            await db.favorites.clear();
            await db.folders.clear();
            await db.pomodoroHistory.clear();
            await db.pomodoroTasks.clear();
            await db.pomodoroActiveState.clear();
            await db.counters.clear();
            await db.progresses.clear();
            await db.progressLabels.clear();
        }
    );

    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map(key => storage.remove(key)));
}

export async function exportUserData(username?: string) {
    const wallpapers = await db.wallpapers.toArray();
    const moods = await db.moods.toArray();
    const pets = await db.pets.toArray();
    const calendar = await db.calendar.toArray();
    const notes = await db.notes.toArray();
    const favorites = await db.favorites.toArray();
    const folders = await db.folders.toArray();
    const counters = await db.counters.toArray();
    const progresses = await db.progresses.toArray();
    const progressLabels = await db.progressLabels.toArray();

    const pomodoroHistory = await db.pomodoroHistory.toArray();
    const pomodoroTasks = await db.pomodoroTasks.toArray();
    const pomodoroActiveState = await db.pomodoroActiveState.toArray();

    const chromeStorage = await getAllChromeStorageData();

    const payload = {
        meta: {
            version: CURRENT_SCHEMA_VERSION,
            exportDate: new Date().toISOString(),
            appName: import.meta.env.VITE_APP_NAME,
            appVersion: import.meta.env.VITE_APP_VERSION,
        },
        indexedDB: {
            wallpapers, moods, pets, calendar, notes, favorites, folders, counters, progresses, progressLabels,
            pomodoroHistory, pomodoroTasks, pomodoroActiveState
        },
        chromeStorage,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const filename = `${username ? username.toLowerCase().split(" ").join("-") : 'aure-homepage'}-backup-${new Date().toISOString().split('T')[0]}`

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function importUserData(file: File) {
    const text = await file.text();

    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("The file is not a valid JSON.");
    }

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error("Invalid backup format: Root must be a JSON object.");
    }

    const backup = data as Record<string, unknown>;

    if (typeof backup.indexedDB !== 'object' || backup.indexedDB === null || Array.isArray(backup.indexedDB)) {
        throw new Error("Invalid backup format: Missing or malformed 'indexedDB' object.");
    }

    if (typeof backup.chromeStorage !== 'object' || backup.chromeStorage === null || Array.isArray(backup.chromeStorage)) {
        throw new Error("Invalid backup format: Missing or malformed 'chromeStorage' object.");
    }

    const dbData = backup.indexedDB as Record<string, unknown>;
    const storageData = backup.chromeStorage as Record<string, unknown>;

    const expectedTables = [
        'wallpapers', 'moods', 'pets', 'calendar', 'notes', 'favorites', 'folders',
        'pomodoroHistory', 'pomodoroTasks', 'pomodoroActiveState', 'counters', 'progresses', 'progressLabels'
    ];

    for (const table of expectedTables) {
        const tableData = dbData[table];
        if (tableData !== undefined) {
            if (!Array.isArray(tableData)) {
                throw new Error(`Invalid backup format: 'indexedDB.${table}' must be an array.`);
            }
            const hasInvalidItems = tableData.some(
                (item: unknown) => typeof item !== 'object' || item === null || Array.isArray(item)
            );
            if (hasInvalidItems) {
                throw new Error(`Invalid backup format: 'indexedDB.${table}' contains invalid non-object items.`);
            }
        }
    }

    // ✅ 1. Clean slate: Wipe existing data first
    await clearAllData();

    // ✅ 2. Write new data
    await db.transaction('rw',
        [
            db.wallpapers, db.moods, db.pets, db.calendar,
            db.notes, db.favorites, db.folders, db.counters,
            db.pomodoroHistory, db.pomodoroTasks, db.pomodoroActiveState,
            db.progresses, db.progressLabels
        ],
        async () => {
            if (Array.isArray(dbData.wallpapers) && dbData.wallpapers.length)
                await db.wallpapers.bulkPut(dbData.wallpapers as Wallpaper[]);
            if (Array.isArray(dbData.moods) && dbData.moods.length)
                await db.moods.bulkPut(dbData.moods as MoodHistory[]);
            if (Array.isArray(dbData.pets) && dbData.pets.length)
                await db.pets.bulkPut(dbData.pets as Pet[]);
            if (Array.isArray(dbData.calendar) && dbData.calendar.length)
                await db.calendar.bulkPut(dbData.calendar as CalendarNote[]);
            if (Array.isArray(dbData.notes) && dbData.notes.length)
                await db.notes.bulkPut(dbData.notes as NoteAndChecklist[]);
            if (Array.isArray(dbData.favorites) && dbData.favorites.length)
                await db.favorites.bulkPut(dbData.favorites as Favorite[]);
            if (Array.isArray(dbData.folders) && dbData.folders.length)
                await db.folders.bulkPut(dbData.folders as Folder[]);
            if (Array.isArray(dbData.counters) && dbData.counters.length)
                await db.counters.bulkPut(dbData.counters as Counter[]);
            if (Array.isArray(dbData.pomodoroHistory) && dbData.pomodoroHistory.length)
                await db.pomodoroHistory.bulkPut(dbData.pomodoroHistory as PomodoroHistoryEntry[]);
            if (Array.isArray(dbData.pomodoroTasks) && dbData.pomodoroTasks.length)
                await db.pomodoroTasks.bulkPut(dbData.pomodoroTasks as PomodoroTask[]);
            if (Array.isArray(dbData.pomodoroActiveState) && dbData.pomodoroActiveState.length)
                await db.pomodoroActiveState.bulkPut(dbData.pomodoroActiveState as PomodoroActiveState[]);
            if (Array.isArray(dbData.progresses) && dbData.progresses.length)
                await db.progresses.bulkPut(dbData.progresses as Progress[]);
            if (Array.isArray(dbData.progressLabels) && dbData.progressLabels.length)
                await db.progressLabels.bulkPut(dbData.progressLabels as ProgressLabel[]);
        }
    );

    for (const [key, value] of Object.entries(storageData)) {
        await storage.set(key, value);
    }
}