import { CircleDashedCheckIcon, CircleDashedIcon } from "lucide-react";
import type { ProgressSort } from "../types";

export const progressFilters = [
    { label: "All", icon: undefined, value: "all" },
    { label: "Undone", icon: <CircleDashedIcon className="size-4" />, value: "undone" },
    { label: "Done", icon: <CircleDashedCheckIcon className="size-4" />, value: "done" },
] as const;

export const progressSortOptions: readonly { label: string; value: ProgressSort }[] = [
    { label: "Priority (High to Low)", value: "priority-desc" },
    { label: "Priority (Low to High)", value: "priority-asc" },
    { label: "Created (Newest first)", value: "created-desc" },
    { label: "Created (Oldest first)", value: "created-asc" },
] as const;
