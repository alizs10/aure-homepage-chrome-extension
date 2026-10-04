import type { Favorite, Folder } from '@/components/settings/components/tabs-details/sites-and-folders/types';
import type { CalendarNote } from '@/components/widgets/calendar/types';
import type { Counter } from '@/components/widgets/counters/types';
import type { MoodHistory } from '@/components/widgets/mood-tracker/types';
import type { NoteAndChecklist } from '@/components/widgets/notes-and-checklists/types';
import type { Pet } from '@/components/widgets/pet-house/types';
import type { PomodoroHistoryEntry, PomodoroTask, PomodoroActiveState } from '@/components/widgets/pomodoro/types';
import type { Progress, ProgressLabel } from '@/components/widgets/progresses/types';
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
    pomodoroTasks!: Table<PomodoroTask, number>; // 🌟 NEW
    pomodoroActiveState!: Table<PomodoroActiveState, string>; // 🌟 NEW
    counters!: Table<Counter, number>; // 🌟 NEW
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
            pomodoroHistory: '++id, type, completedAt, taskId', // Added taskId index
            pomodoroTasks: '++id, name, createdAt', // 🌟 NEW
            pomodoroActiveState: 'id', // 🌟 NEW (singleton)
            counters: '++id, type, createdAt', // 🌟 NEW
            progresses: '++id, completed, deadline', // 🌟 NEW
            progressLabels: '++id, name', // 🌟 NEW
        });
    }
}

export const db = new NewTabDB();