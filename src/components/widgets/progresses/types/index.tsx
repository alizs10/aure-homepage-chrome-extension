import { CircleDashedCheckIcon, CircleDashedIcon } from "lucide-react";

export type Priority = 'low' | 'medium' | 'high';
export type InteractionMode = 'linear' | 'free';
export type ProgressColor = 'default' | 'cherry' | 'tangerine' | 'lime' | 'ocean' | 'orchid';

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

// 🌟 New Label Type
export interface ProgressLabel {
    id: number;
    name: string;
}

export const progressFilters = [
    { label: "All", icon: undefined, value: "all" },
    { label: "Undone", icon: <CircleDashedIcon className="size-4" />, value: "undone" },
    { label: "Done", icon: <CircleDashedCheckIcon className="size-4" />, value: "done" },
] as const;

export type ProgressFilter = typeof progressFilters[number]["value"];