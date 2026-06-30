export interface Note {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Checklist extends Note {
    status: boolean;
}

export type NoteAndChecklist = Note | Checklist