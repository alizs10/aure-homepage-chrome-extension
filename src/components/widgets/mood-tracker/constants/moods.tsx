import { AngryIcon, FrownIcon, LaughIcon, MehIcon, SmileIcon } from "lucide-react";
import type { MoodType } from "../types";
import { type ReactNode } from "react";

export const MOODS_OPTIONS: {
    id: MoodType,
    label: string,
    icon: ReactNode
}[] = [
        {
            id: 'great',
            label: "Great",
            icon: <LaughIcon className="size-10 text-indigo-600 dark:text-indigo-500" />
        },
        {
            id: 'good',
            label: "Good",
            icon: <SmileIcon className="size-10 text-success" />
        },
        {
            id: 'okay',
            label: "Okay",
            icon: <MehIcon className="size-10 text-muted-foreground" />
        },
        {
            id: 'meh',
            label: "Meh",
            icon: <FrownIcon className="size-10 text-warning" />
        },
        {
            id: 'bad',
            label: "Bad",
            icon: <AngryIcon className="size-10 text-destructive" />
        }
    ];

export const getMoodBgColor = (mood: MoodType) => {
    switch (mood) {
        case 'great':
            return 'bg-indigo-400 dark:bg-indigo-500';
        case 'good':
            return 'bg-lime-400 dark:bg-lime-500';
        case 'okay':
            return 'bg-gray-300 dark:bg-gray-400';
        case 'meh':
            return 'bg-yellow-300 dark:bg-yellow-400';
        case 'bad':
            return 'bg-red-400 dark:bg-red-500';
        default:
            return '';
    }
};

export const getMoodTextColor = (mood: MoodType, foreground = true) => {
    switch (mood) {
        case 'great':
            return foreground ? 'text-white' : 'text-indigo-600 dark:text-indigo-500';
        case 'good':
            return foreground ? 'text-black' : 'text-success';
        case 'okay':
            return foreground ? 'text-black' : 'text-muted-foreground';
        case 'meh':
            return foreground ? 'text-black' : 'text-warning';
        case 'bad':
            return foreground ? 'text-destructive-foreground' : 'text-destructive';
        default:
            return '';
    }
};

export const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
        case "great":
            return <LaughIcon className="size-4.5" />;
        case "good":
            return <SmileIcon className="size-4.5" />;
        case "okay":
            return <MehIcon className="size-4.5" />;
        case "meh":
            return <FrownIcon className="size-4.5" />;
        case "bad":
            return <AngryIcon className="size-4.5" />;
        default:
            return null;
    }
};

export const getWeekColor = (score: number) => {
    if (score >= 4) {
        return "bg-indigo-400 dark:bg-indigo-500 text-white";
    }

    if (score >= 3) {
        return "bg-lime-400 dark:bg-lime-500 text-black";
    }

    if (score >= 2) {
        return "bg-gray-300 dark:bg-gray-400 text-black";
    }

    if (score >= 1) {
        return "bg-yellow-300 dark:bg-yellow-400 text-black ";
    }

    return "bg-red-400 dark:bg-red-500 text-destructive-foreground";
};

export const getScoreIcon = (score: number) => {
    if (score >= 4) {
        return <LaughIcon className="size-4.5" />;
    }

    if (score >= 3) {
        return <SmileIcon className="size-4.5" />;
    }

    if (score >= 2) {
        return <MehIcon className="size-4.5" />;
    }

    if (score >= 1) {
        return <FrownIcon className="size-4.5" />;
    }

    return <AngryIcon className="size-4.5" />;
};