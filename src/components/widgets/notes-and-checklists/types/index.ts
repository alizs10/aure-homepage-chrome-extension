// Block types for advanced notes
export interface TextBlock {
    id: string;
    type: 'text';
    content: string;
}

export interface TaskBlock {
    id: string;
    type: 'task';
    content: string;
    status: boolean;
}

export type Block = TextBlock | TaskBlock;

export interface Note {
    id: number;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Checklist extends Note {
    status: boolean;
}

export interface AdvancedNote extends Note {
    type: 'advanced';
    blocks: Block[];
}

export type NoteAndChecklist = Note | Checklist | AdvancedNote;