export interface Note {
    id: number;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Checklist extends Note {
    status: boolean;
}

export type NoteAndChecklist = Note | Checklist