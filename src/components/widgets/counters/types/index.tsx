import { ClockArrowDown, ClockArrowUp } from 'lucide-react';
export type CounterType = 'count_up' | 'count_down';
export type CounterColor = 'default' | 'cherry' | 'tangerine' | 'lime' | 'ocean' | 'orchid' | 'golden';

export interface Counter {
    id: number;
    name: string;
    type: CounterType;
    color: CounterColor;
    startDate: string; // yyyy-MM-dd
    endDate?: string;  // yyyy-MM-dd (required for count_down)
    isRecurring?: boolean;
    intervalDays?: number; // Required if isRecurring is true
    createdAt: number;
    updatedAt: number;
}

export const counterFilters = [
    { label: "All", icon: undefined, value: "all" },
    { label: "Count Ups", icon: <ClockArrowUp className="size-3.5" />, value: "count_ups" },
    { label: "Count Downs", icon: <ClockArrowDown className="size-3.5" />, value: "count_downs" },
] as const;

export type CounterFilter = typeof counterFilters[number]["value"];