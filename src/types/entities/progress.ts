export type Priority = 'low' | 'medium' | 'high';
export type InteractionMode = 'linear' | 'free';
export type ProgressColor = 'default' | 'cherry' | 'tangerine' | 'lime' | 'ocean' | 'orchid' | 'golden';

export interface ProgressStep {
    id: string;
    content: string;
    completed: boolean;
}

export interface Progress {
    id: number;
    title: string;
    label: string;
    priority: Priority;
    deadline?: string; // yyyy-MM-dd
    color: ProgressColor;
    steps: ProgressStep[];
    interactionMode: InteractionMode;
    activeStepIndex: number;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface ProgressLabel {
    id: number;
    name: string;
}

export type ProgressFilter = 'all' | 'undone' | 'done';
export type ProgressSort = 'priority-desc' | 'priority-asc' | 'created-desc' | 'created-asc';
