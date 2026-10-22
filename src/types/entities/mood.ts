export type MoodType = "great" | "good" | "okay" | "meh" | "bad";

export type MoodHistory = {
    id: number;
    date: string; // yyyy-MM-dd
    mood: MoodType;
    createdAt: number;
    updatedAt: number;
};

export type MoodFilter = "last30days" | "thisWeek" | "thisMonth" | "thisYear";

export type DateBucket = {
    label: string;
    from: Date;
    to: Date;
};
