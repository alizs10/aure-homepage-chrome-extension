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

export type CounterFilter = 'all' | 'count_ups' | 'count_downs';
