import type { PomodoroSettings } from '@/components/widgets/pomodoro/types';

//theme
export type Theme = 'dark' | 'light' | 'system'

//wallpaper
export type Wallpaper = {
    id: string,
    name: string,
    variants: {
        light?: string,
        dark?: string,
    },
};

//blur
export const blurOptions = [
    { key: "none", label: "Off", value: "0px" },
    { key: "xs", label: "Very Low", value: "2px" },
    { key: "sm", label: "Low", value: "4px" },
    { key: "md", label: "Medium", value: "8px" },
    { key: "lg", label: "High", value: "12px" },
    { key: "xl", label: "Very High", value: "16px" },
    { key: "2xl", label: "Ultra", value: "24px" },
    { key: "3xl", label: "Maximum", value: "32px" },
] as const;

export type BlurSize = typeof blurOptions[number]["key"];

//widgets
export type WidgetId =
    | "notes-and-checklists"
    | "calendar"
    | "mood-tracker"
    | "pet-house"
    | "pomodoro"
    | "counters"
    | "progresses";

// NEW: Tracks internal preferences for each specific widget
export type WidgetPreferences = {
    "notes-and-checklists": {
        showChecked: boolean;
    };
    "mood-tracker": {
        showChart: boolean;
    };
    pomodoro: PomodoroSettings;
};

//accent
export const accentOptions = [
    {
        id: "default",
        label: "Default",
        light: "hsl(249.2 75.8% 58.6%)",
        dark: "hsl(243.6 85.5% 66.7%)",
        foreground: { light: "hsl(0 0% 100%)", dark: "hsl(0 0% 100%)" }
    },
    {
        id: "cherry",
        label: "Cherry",
        light: "hsl(0 84% 60%)",
        dark: "hsl(0 72% 65%)",
        foreground: { light: "hsl(0 0% 100%)", dark: "hsl(0 0% 100%)" }
    },
    {
        id: "tangerine",
        label: "Tangerine",
        light: "hsl(24 95% 53%)",
        dark: "hsl(24 90% 60%)",
        foreground: { light: "hsl(0 0% 100%)", dark: "hsl(24 95% 15%)" }
    },
    {
        id: "lime",
        label: "Lime",
        light: "hsl(85 85% 35%)",
        dark: "hsl(84 81% 44%)",
        foreground: { light: "hsl(0 0% 100%)", dark: "hsl(85 85% 10%)" }
    },
    {
        id: "ocean",
        label: "Ocean",
        light: "hsl(217 91% 60%)",
        dark: "hsl(217 91% 68%)",
        foreground: { light: "hsl(0 0% 100%)", dark: "hsl(217 91% 15%)" }
    },
    {
        id: "orchid",
        label: "Orchid",
        light: "hsl(315 83% 57%)",
        dark: "hsl(315 83% 65%)",
        foreground: { light: "hsl(0 0% 100%)", dark: "hsl(315 83% 15%)" }
    },
    {
        id: "golden",
        label: "Golden",
        light: "hsl(39 81% 40%)",
        dark: "hsl(45 100% 68%)",
        foreground: {
            light: "hsl(0 0% 100%)",
            dark: "hsl(42 100% 10%)"
        }
    },
] as const;

export type Accent = typeof accentOptions[number]["id"];

// 🌟 Widget position in the grid
export type WidgetPosition = {
    widgetId: WidgetId;
    page: number;
    column: number;
    row: number;
    size: 1 | 2;
};

// 🌟 Complete layout configuration
export type WidgetLayout = {
    positions: WidgetPosition[];
    totalPages: number;
};

//settings
export interface Settings {
    schema_version: number;
    name: string
    theme: Theme
    wallpaper: "default" | string
    blur: BlurSize
    widgetPreferences?: Partial<WidgetPreferences>;
    accent: Accent
    show_top_sites: boolean
    show_favorites: boolean
    show_folders: boolean
    widget_layout?: WidgetLayout;
}