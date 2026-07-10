// contexts/NotesAndChecklistsContext.tsx
import { createContext } from 'react';
import type { NoteAndChecklist } from '../types';

interface NotesAndChecklistsContextType {
    data: NoteAndChecklist[];
    editable: NoteAndChecklist | undefined;
    addItem: (content: string) => void;
    removeItem: (id: number) => void;
    toggleCheckbox: (id: number) => void;
    startEdit: (id: number) => void;
    updateItem: (content: string) => void;
    cancelEdit: () => void;
    notesCount: number;
    itemsCount: number;
    checkedItemsCount: number;
}

export const NotesAndChecklistsContext = createContext<NotesAndChecklistsContextType | undefined>(undefined);