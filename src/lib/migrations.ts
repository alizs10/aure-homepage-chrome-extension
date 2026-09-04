import { useSettingsStore } from "@/stores";
import { FoldersRepository } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/db";
import { useFoldersStore } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/store";
import type { Folder, Website } from "@/components/settings/components/tabs-details/sites-and-folders/types";
import { DEFAULT_FOLDERS } from "@/components/wizard/constants/defaultFolders";

// 🌟 Current schema version - increment when adding new migrations
export const CURRENT_SCHEMA_VERSION = 1;

// 🌟 Migration definitions
const migrations: Record<number, () => Promise<void>> = {
    // Version 1: Add default folders feature
    1: async () => {
        const existing = await FoldersRepository.getAll();
        if (existing.length === 0) {
            const baseTime = Date.now();
            const foldersToInsert: Folder[] = DEFAULT_FOLDERS.map((f, folderIndex) => ({
                id: baseTime + folderIndex,
                title: f.title,
                order: folderIndex,
                websites: f.websites.map((w, siteIndex) => ({
                    id: baseTime + folderIndex * 100 + siteIndex,
                    title: w.title,
                    url: w.url,
                    order: siteIndex
                })) as Website[]
            }));

            for (const folder of foldersToInsert) {
                await FoldersRepository.put(folder);
            }
        }

        // Update settings to include new fields
        const { settings, update } = useSettingsStore.getState();
        if (settings) {
            await update({
                schema_version: 1,
                show_folders: settings.show_folders ?? true,
            });
        }

        // Refresh the folders store
        await useFoldersStore.getState().initialize();
    },
};

// 🌟 Run all pending migrations
export async function runMigrations(): Promise<void> {
    const { settings } = useSettingsStore.getState();

    if (!settings) return; // No settings = wizard hasn't run yet

    const currentVersion = settings.schema_version ?? 0;

    if (currentVersion >= CURRENT_SCHEMA_VERSION) return; // Already up to date

    // Run each migration in order
    for (let version = currentVersion + 1; version <= CURRENT_SCHEMA_VERSION; version++) {
        const migration = migrations[version];
        if (migration) {
            await migration();
        }
    }
}