import { db } from "@/lib/db";
import { storage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/storage_keys";

// ✅ Import types for strict casting during import
import type { Favorite } from '@/components/settings/components/tabs-details/sites-and-shortcuts/types';
import type { CalendarNote } from '@/components/widgets/calendar/types';
import type { MoodHistory } from '@/components/widgets/mood-tracker/types';
import type { NoteAndChecklist } from '@/components/widgets/notes-and-checklists/types';
import type { Pet } from '@/components/widgets/pet-house/types';
import type { Wallpaper } from '@/types';

// Helper to fetch all Chrome Storage data
async function getAllChromeStorageData() {
    const data: Record<string, unknown> = {};

    const keys = Object.values(STORAGE_KEYS);
    for (const key of keys) {
        const value = await storage.get<unknown>(key);
        if (value !== undefined && value !== null) {
            data[key] = value;
        }
    }

    const settings = await storage.get<unknown>("settings");
    if (settings !== undefined && settings !== null) {
        data["settings"] = settings;
    }

    return data;
}

// Helper to safely wipe all data before restoring
async function clearAllData() {
    await db.transaction('rw',
        [db.wallpapers, db.moods, db.pets, db.calendar, db.notes, db.favorites],
        async () => {
            await db.wallpapers.clear();
            await db.moods.clear();
            await db.pets.clear();
            await db.calendar.clear();
            await db.notes.clear();
            await db.favorites.clear();
        }
    );

    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map(key => storage.remove(key)));
    await storage.remove("settings");
}

export async function exportUserData() {
    const wallpapers = await db.wallpapers.toArray();
    const moods = await db.moods.toArray();
    const pets = await db.pets.toArray();
    const calendar = await db.calendar.toArray();
    const notes = await db.notes.toArray();
    const favorites = await db.favorites.toArray();

    const chromeStorage = await getAllChromeStorageData();

    const payload = {
        meta: {
            version: 1,
            exportDate: new Date().toISOString(),
            appName: import.meta.env.VITE_APP_NAME,
            appVersion: import.meta.env.VITE_APP_VERSION,
        },
        indexedDB: { wallpapers, moods, pets, calendar, notes, favorites },
        chromeStorage,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `aure-backup-${new Date().toISOString().split('T')[0]}.json`;
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

    // ✅ 1. Root must be a plain object (not an array or null)
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error("Invalid backup format: Root must be a JSON object.");
    }

    const backup = data as Record<string, unknown>;

    // ✅ 2. Check for required root keys and ensure they are plain objects
    if (typeof backup.indexedDB !== 'object' || backup.indexedDB === null || Array.isArray(backup.indexedDB)) {
        throw new Error("Invalid backup format: Missing or malformed 'indexedDB' object.");
    }

    if (typeof backup.chromeStorage !== 'object' || backup.chromeStorage === null || Array.isArray(backup.chromeStorage)) {
        throw new Error("Invalid backup format: Missing or malformed 'chromeStorage' object.");
    }

    const dbData = backup.indexedDB as Record<string, unknown>;
    const storageData = backup.chromeStorage as Record<string, unknown>;

    // ✅ 3. Deep validate IndexedDB tables
    const expectedTables = ['wallpapers', 'moods', 'pets', 'calendar', 'notes', 'favorites'];
    for (const table of expectedTables) {
        const tableData = dbData[table];
        if (tableData !== undefined) {
            // Must be an array
            if (!Array.isArray(tableData)) {
                throw new Error(`Invalid backup format: 'indexedDB.${table}' must be an array.`);
            }
            // Every item in the array must be a plain object (not a primitive, not an array)
            const hasInvalidItems = tableData.some(
                (item: unknown) => typeof item !== 'object' || item === null || Array.isArray(item)
            );
            if (hasInvalidItems) {
                throw new Error(`Invalid backup format: 'indexedDB.${table}' contains invalid non-object items.`);
            }
        }
    }

    // --- Proceed with Import ---
    await clearAllData();

    await db.transaction('rw',
        [db.wallpapers, db.moods, db.pets, db.calendar, db.notes, db.favorites],
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
        }
    );

    for (const [key, value] of Object.entries(storageData)) {
        await storage.set(key, value);
    }

    // ✅ Removed window.location.reload() from here. 
    // We let the UI component handle the success toast and the delayed reload.
}