import { useSettingsStore } from "@/stores";
import { FoldersRepository } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/db";
import { useFoldersStore } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/store";
import type { Folder, Website } from "@/components/settings/components/tabs-details/sites-and-folders/types";
import { DEFAULT_FOLDERS } from "@/components/wizard/constants/defaultFolders";
import { NotesRepository } from "@/components/widgets/notes-and-checklists/db";
import type { AdvancedNote, Block, NoteAndChecklist, Note, Checklist } from "@/components/widgets/notes-and-checklists/types";

// 🌟 Type for old notes before migration
type LegacyNote = Note & { status?: boolean };

// 🌟 Type guard to check if a note is already migrated
function isAdvancedNote(note: NoteAndChecklist | LegacyNote): note is AdvancedNote {
    return 'type' in note && note.type === 'advanced';
}

// 🌟 Type guard to check if a legacy note is a checklist
function isLegacyChecklist(note: LegacyNote): note is Checklist {
    return 'status' in note;
}

// 🌟 Current schema version - increment when adding new migrations
export const CURRENT_SCHEMA_VERSION = 3; // 🌟 Bumped to 3

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

    // Version 2: Migrate notes to support advanced block-based format
    2: async () => {
        const notes = await NotesRepository.getAll();

        for (const note of notes) {
            if (isAdvancedNote(note)) continue;

            const legacyNote = note as LegacyNote;
            const isChecklist = legacyNote.content.startsWith("[] ");

            const blockId = `${legacyNote.id}-block-0`;
            let block: Block;
            let updatedContent = legacyNote.content;

            if (isChecklist) {
                const status = isLegacyChecklist(legacyNote) ? legacyNote.status : false;
                const prefix = status ? '[x] ' : '[] ';

                block = {
                    id: blockId,
                    type: 'task',
                    content: legacyNote.content.substring(3),
                    status: status,
                };

                // 🌟 Update content to use [x] if the task was checked
                updatedContent = prefix + legacyNote.content.substring(3);
            } else {
                block = {
                    id: blockId,
                    type: 'text',
                    content: legacyNote.content,
                };
            }

            const advancedNote: AdvancedNote = {
                id: legacyNote.id,
                content: updatedContent, // 🌟 Use updated content
                createdAt: legacyNote.createdAt,
                updatedAt: legacyNote.updatedAt,
                type: 'advanced',
                blocks: [block],
            };

            await NotesRepository.put(advancedNote as NoteAndChecklist);
        }

        const { settings, update } = useSettingsStore.getState();
        if (settings) {
            await update({
                schema_version: 2,
            });
        }
    },

    // 🌟 Version 3: Add Counters widget to existing users' settings
    3: async () => {
        const { settings, update } = useSettingsStore.getState();
        if (settings) {
            await update({
                schema_version: 3,
                widgets: {
                    ...settings.widgets,
                    // Add "counters" and default it to true if it doesn't exist
                    "counters": settings.widgets?.["counters"] ?? true,
                },
            });
        }
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