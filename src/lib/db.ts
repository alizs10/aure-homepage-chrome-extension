import type { CalendarNote } from "@/components/widgets/calendar/types";
import type { MoodHistory } from "@/components/widgets/mood-tracker/types";
import type { NoteAndChecklist } from "@/components/widgets/notes-and-checklists/types";
import type { Pet } from "@/components/widgets/pet-house/types";
import type { Wallpaper } from "@/types";

const DB_NAME = "newtab-db";
const DB_VERSION = 7;

export const DB_STORES = {
    wallpapers: "wallpapers",
    moods: "moods",
    pets: "pets",
    calendar: "calendar",
    notes: "notes",
} as const;

export type DBStore = (typeof DB_STORES)[keyof typeof DB_STORES];

// --- 1. Strict Type Mapping ---
// Map each store name to its specific data structure. 
// Update these interfaces to match your actual data models.
// In db.ts
export interface DBValueTypes {
    wallpapers: Wallpaper;
    moods: MoodHistory;
    pets: Pet;
    calendar: CalendarNote;
    notes: NoteAndChecklist;
}

// --- 2. Connection Caching ---
let dbPromise: Promise<IDBDatabase> | null = null;

export function openDB(): Promise<IDBDatabase> {
    // Return cached connection if it exists
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;


            if (!db.objectStoreNames.contains(DB_STORES.calendar)) {
                const store = db.createObjectStore(DB_STORES.calendar, {
                    keyPath: "id",
                });

                store.createIndex("date", "date", { unique: true });
            }

            Object.values(DB_STORES).forEach((storeName) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "id" });
                }
            });
        };

        request.onsuccess = () => {
            const db = request.result;

            // Invalidate cache if the DB is closed or upgraded in another tab
            db.onversionchange = () => {
                db.close();
                dbPromise = null;
            };
            db.onclose = () => {
                dbPromise = null;
            };

            resolve(db);
        };

        request.onerror = () => {
            dbPromise = null; // Reset so it can be retried next time
            reject(request.error);
        };
    });

    return dbPromise;
}

// --- 3. Transaction Helper ---
// Abstracts away the repetitive Promise and error handling boilerplate
async function executeTransaction<S extends DBStore, T>(
    store: S,
    mode: IDBTransactionMode,
    operation: (objectStore: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    const db = await openDB();

    return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const objectStore = tx.objectStore(store);
        const request = operation(objectStore);

        let result: T;

        request.onsuccess = () => {
            result = request.result;
        };

        // CRITICAL: Wait for the transaction to complete to ensure data is actually committed to disk
        tx.oncomplete = () => resolve(result);

        // Handle errors from either the specific request or the whole transaction
        request.onerror = () => reject(request.error);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted"));
    });
}

// --- 4. Strictly Typed CRUD Operations ---

export function put<S extends DBStore>(
    store: S,
    value: DBValueTypes[S] & { id: IDBValidKey }
): Promise<IDBValidKey> {
    return executeTransaction<S, IDBValidKey>(
        store,
        "readwrite",
        (os) => os.put(value)
    );
}

export function get<S extends DBStore>(
    store: S,
    id: IDBValidKey
): Promise<DBValueTypes[S] | undefined> {
    return executeTransaction<S, DBValueTypes[S] | undefined>(
        store,
        "readonly",
        // Native TS definitions use 'any', so we cast it to our strict type
        (os) => os.get(id) as IDBRequest<DBValueTypes[S] | undefined>
    );
}

export function getAll<S extends DBStore>(store: S): Promise<DBValueTypes[S][]> {
    return executeTransaction<S, DBValueTypes[S][]>(
        store,
        "readonly",
        (os) => os.getAll() as IDBRequest<DBValueTypes[S][]>
    );
}

export function remove<S extends DBStore>(
    store: S,
    id: IDBValidKey
): Promise<void> {
    return executeTransaction<S, undefined>(
        store,
        "readwrite",
        (os) => os.delete(id)
    ).then(() => undefined);
}

export function clear<S extends DBStore>(store: S): Promise<void> {
    return executeTransaction<S, undefined>(
        store,
        "readwrite",
        (os) => os.clear()
    ).then(() => undefined);
}

export function getByIndex<
    S extends DBStore,
    K extends keyof DBValueTypes[S]
>(
    store: S,
    index: K,
    value: IDBValidKey
): Promise<DBValueTypes[S] | undefined> {
    return executeTransaction<S, DBValueTypes[S] | undefined>(
        store,
        "readonly",
        (os) =>
            os.index(index as string).get(value) as IDBRequest<
                DBValueTypes[S] | undefined
            >
    );
}

export async function clearAll(): Promise<void> {
    await Promise.all(
        Object.values(DB_STORES).map((store) => clear(store))
    );
}

export async function deleteDatabase(): Promise<void> {
    const db = await openDB();

    db.close();
    dbPromise = null;

    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        request.onblocked = () =>
            reject(new Error("Database deletion blocked"));
    });
}

// --- 5. Unified Export ---
export const db = {
    put,
    get,
    getAll,
    getByIndex,
    remove,
    clear,
    clearAll,
    deleteDatabase
};