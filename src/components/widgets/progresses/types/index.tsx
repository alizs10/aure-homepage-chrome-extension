import { CircleDashedCheckIcon, CircleDashedIcon } from "lucide-react";
export type * from '@/types/entities/progress';

export const progressFilters = [
    { label: "All", icon: undefined, value: "all" },
    { label: "Undone", icon: <CircleDashedIcon className="size-4" />, value: "undone" },
    { label: "Done", icon: <CircleDashedCheckIcon className="size-4" />, value: "done" },
] as const;