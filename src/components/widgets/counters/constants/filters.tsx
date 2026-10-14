import { ClockArrowDown, ClockArrowUp } from 'lucide-react';

export const counterFilters = [
    { label: "All", icon: undefined, value: "all" },
    { label: "Count Ups", icon: <ClockArrowUp className="size-3.5" />, value: "count_ups" },
    { label: "Count Downs", icon: <ClockArrowDown className="size-3.5" />, value: "count_downs" },
] as const;
