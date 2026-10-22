export * from '@/types/entities/mood';
import type { MoodType } from '@/types/entities/mood';

export const moodMessages: Record<MoodType, string> = {
    great: "Amazing! You're feeling great today.",
    good: "Nice! Good mood saved.",
    okay: "It's okay. Mood logged.",
    meh: "Meh days happen. Thanks for logging.",
    bad: "Bad day noted. Hang in there.",
};

export const filters = [
    { label: "Last 30 Days", value: "last30days" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "This Year", value: "thisYear" },
] as const;