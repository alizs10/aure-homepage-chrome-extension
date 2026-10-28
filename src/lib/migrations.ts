import { useSettingsStore } from "@/stores";
import { seedDefaultFolders, useFoldersStore } from "@/features/bookmarks";
import { DEFAULT_WIDGET_LAYOUT } from "@/constants/widget-weights";
import { NotesRepository } from "@/features/widgets";
import type { AdvancedNote, Block, NoteAndChecklist, Note, Checklist } from "@/types/entities";
import type { Settings, WidgetLayout } from "@/types";
import { isFirefox } from "@/lib/browser";

type LegacyNote = Note & { status?: boolean };

function isAdvancedNote(note: NoteAndChecklist | LegacyNote): note is AdvancedNote {
    return 'type' in note && note.type === 'advanced';
}

function isLegacyChecklist(note: LegacyNote): note is Checklist {
    return 'status' in note;
}

export const CURRENT_SCHEMA_VERSION = 4;

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
        await seedDefaultFolders();

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

        const legacySettings = settings as LegacySettings;
        let widgetLayout: WidgetLayout | undefined = legacySettings.widget_layout;

        if (!widgetLayout) {
            widgetLayout = DEFAULT_WIDGET_LAYOUT;
        }

        await update({
            schema_version: 3,
            widget_layout: widgetLayout,
        });
    },

    // Version 4: Add wallpaper_blur and wallpaper_brightness and Accent
    4: async () => {
        const { settings, update } = useSettingsStore.getState();
        if (!settings) return;

        await update({
            schema_version: 4,
            accent: "golden",
            wallpaper_blur: settings.wallpaper_blur ?? (isFirefox ? 'xs' : 'none'),
            wallpaper_brightness: settings.wallpaper_brightness ?? '100',
            blur: isFirefox
                ? (settings.blur === 'xs' ? 'none' : (settings.blur ?? 'none'))
                : (settings.blur ?? 'xs'),
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