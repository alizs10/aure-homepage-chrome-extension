import type { Favorite } from '@/components/settings/components/tabs-details/sites-and-shortcuts/types';
import type { CalendarNote } from '@/components/widgets/calendar/types';
import type { MoodHistory } from '@/components/widgets/mood-tracker/types';
import type { NoteAndChecklist } from '@/components/widgets/notes-and-checklists/types';
import type { Pet } from '@/components/widgets/pet-house/types';
import type { Wallpaper } from '@/types';
import Dexie, { type Table } from 'dexie';

// 1. Define the DB class and strictly type the tables
export class NewTabDB extends Dexie {
    wallpapers!: Table<Wallpaper, string>; // string is the type of the primary key
    moods!: Table<MoodHistory, number>;
    pets!: Table<Pet, number>;
    calendar!: Table<CalendarNote, number>;
    notes!: Table<NoteAndChecklist, number>;
    favorites!: Table<Favorite, number>;

    constructor() {
        super('newtab-db');

        // 2. Declarative Schema Definition
        // 'id' is the primary key. 'date' is a secondary index!
        this.version(9).stores({
            wallpapers: 'id',
            moods: 'id',
            pets: 'id',
            calendar: 'id, date', // 'date' is automatically indexed
            notes: 'id',
            favorites: 'id',
        });

        // 3. Future migrations are incredibly easy
        // this.version(2).stores({
        //   calendar: 'id, date, *tags', // Added a multi-entry index for tags
        //   todos: 'id, status'          // Added a brand new store
        // });
    }
}

export const db = new NewTabDB();