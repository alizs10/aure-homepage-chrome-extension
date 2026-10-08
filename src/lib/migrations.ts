import { useSettingsStore } from "@/stores";
import { FoldersRepository } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/db";
import { useFoldersStore } from "@/components/settings/components/tabs-details/sites-and-folders/components/folders/store";
import type { Folder, Website } from "@/components/settings/components/tabs-details/sites-and-folders/types";
import { DEFAULT_FOLDERS } from "@/components/wizard/constants/defaultFolders";
import { NotesRepository } from "@/components/widgets/notes-and-checklists/db";
import type { AdvancedNote, Block, NoteAndChecklist, Note, Checklist } from "@/components/widgets/notes-and-checklists/types";
import type { Settings, WidgetLayout } from "@/types";

type LegacyNote = Note & { status?: boolean };

function isAdvancedNote(note: NoteAndChecklist | LegacyNote): note is AdvancedNote {
    return 'type' in note && note.type === 'advanced';
}

function isLegacyChecklist(note: LegacyNote): note is Checklist {
    return 'status' in note;
}

export const CURRENT_SCHEMA_VERSION = 3;

// Type for settings during migration (may have old properties)
type LegacySettings = Settings & {
    widget_layout?: WidgetLayout;
    widgets?: Record<string, boolean>;
    layout_mode?: string;
    default_page?: number;
};

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

        const { settings, update } = useSettingsStore.getState();
        if (settings) {
            await update({
                schema_version: 1,
                show_folders: settings.show_folders ?? true,
            });
        }

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
                content: updatedContent,
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

    // Version 3: Transition to customizer-based layout system
    3: async () => {
        const { settings, update } = useSettingsStore.getState();
        if (!settings) return;

        // Cast to LegacySettings to safely access old properties
        const legacySettings = settings as LegacySettings;

        // Initialize widget_layout if it doesn't exist
        let widgetLayout: WidgetLayout | undefined = legacySettings.widget_layout;

        if (!widgetLayout) {
            // Create a default layout with main widgets on page 1
            widgetLayout = {
                positions: [
                    { widgetId: "notes-and-checklists", page: 1, column: 0, row: 0, size: 2 },
                    { widgetId: "calendar", page: 1, column: 1, row: 0, size: 2 },
                    { widgetId: "pomodoro", page: 1, column: 2, row: 0, size: 2 },
                ],
                totalPages: 1,
            };
        }

        // Update settings with new schema
        await update({
            schema_version: 3,
            widget_layout: widgetLayout,
        });
    },
};

export async function runMigrations(): Promise<void> {
    const { settings } = useSettingsStore.getState();

    if (!settings) return;

    const currentVersion = settings.schema_version ?? 0;

    if (currentVersion >= CURRENT_SCHEMA_VERSION) return;

    for (let version = currentVersion + 1; version <= CURRENT_SCHEMA_VERSION; version++) {
        const migration = migrations[version];
        if (migration) {
            await migration();
        }
    }
}