import type { Favorite, Folder } from '@/features/bookmarks';
import type {
    CalendarNote,
    Counter,
    MoodHistory,
    NoteAndChecklist,
    Pet,
    PomodoroHistoryEntry,
    PomodoroTask,
    PomodoroActiveState,
    Progress,
    ProgressLabel,
} from '@/types/entities';
import type { Wallpaper } from '@/types';
import Dexie, { type Table } from 'dexie';

export class NewTabDB extends Dexie {
    wallpapers!: Table<Wallpaper, string>;
    moods!: Table<MoodHistory, number>;
    pets!: Table<Pet, number>;
    calendar!: Table<CalendarNote, number>;
    notes!: Table<NoteAndChecklist, number>;
    favorites!: Table<Favorite, number>;
    folders!: Table<Folder, number>;
    pomodoroHistory!: Table<PomodoroHistoryEntry, number>;
    pomodoroTasks!: Table<PomodoroTask, number>;
    pomodoroActiveState!: Table<PomodoroActiveState, string>;
    counters!: Table<Counter, number>;
    progresses!: Table<Progress, number>;
    progressLabels!: Table<ProgressLabel, number>;

    constructor() {
        super('newtab-db');

        this.version(14).stores({
            wallpapers: 'id',
            moods: 'id',
            pets: 'id',
            calendar: 'id, date',
            notes: 'id',
            favorites: 'id',
            folders: 'id',
            pomodoroHistory: '++id, type, completedAt, taskId',
            pomodoroTasks: '++id, name, createdAt',
            pomodoroActiveState: 'id',
            counters: '++id, type, createdAt',
            progresses: '++id, completed, deadline',
            progressLabels: '++id, name',
        });
    }
}

export const db = new NewTabDB();