export type MoodType = "great" | "good" | "okay" | "meh" | "bad"
export const moodMessages: Record<MoodType, string> = {
    great: "Amazing! You're feeling great today.",
    good: "Nice! Good mood saved.",
    okay: "It's okay. Mood logged.",
    meh: "Meh days happen. Thanks for logging.",
    bad: "Bad day noted. Hang in there.",
};

export type MoodHistory = {
    id: number;
    date: string; // yyyy-MM-dd
    mood: MoodType;
    createdAt: number;
    updatedAt: number;
};

export const filters = [
    { label: "Last 30 Days", value: "last30days" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "This Year", value: "thisYear" },
] as const;

export type MoodFilter = typeof filters[number]["value"];

export type DateBucket = {
    label: string;
    from: Date;
    to: Date;
};