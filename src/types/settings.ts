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
    { key: "md", label: "Medium", value: "12px" },
    { key: "lg", label: "High", value: "16px" },
    { key: "xl", label: "Very High", value: "24px" },
    { key: "2xl", label: "Ultra", value: "40px" },
    { key: "3xl", label: "Maximum", value: "64px" },
] as const;

export type BlurSize = typeof blurOptions[number]["key"];

//widgets
export type WidgetId =
    | "notes-and-checklists"
    | "calendar"
    | "mood-tracker"
    | "pet-house";

export type WidgetSettings = Record<WidgetId, boolean>;

// NEW: Tracks internal preferences for each specific widget
export type WidgetPreferences = {
    "notes-and-checklists": {
        showChecked: boolean;
    };
    "mood-tracker": {
        showChart: boolean;
    };

};

//accent
export const accentOptions = [
    {
        id: "default",
        label: "Default",
        light: "hsl(249.2 75.8% 58.6%)",
        dark: "hsl(243.6 85.5% 66.7%)",
    },
    {
        id: "cherry",
        label: "Cherry",
        light: "hsl(0 84% 60%)",
        dark: "hsl(0 72% 65%)",
    },
    {
        id: "tangerine",
        label: "Tangerine",
        light: "hsl(24 95% 53%)",
        dark: "hsl(24 90% 60%)",
    },
    {
        id: "lime",
        label: "Lime",
        light: "hsl(84 81% 44%)",
        dark: "hsl(84 70% 50%)",
    },
    {
        id: "ocean",
        label: "Ocean",
        light: "hsl(217 91% 60%)",
        dark: "hsl(217 91% 68%)",
    },
    {
        id: "orchid",
        label: "Orchid",
        light: "hsl(315 83% 57%)",
        dark: "hsl(315 83% 65%)",
    },
] as const;

export type Accent = typeof accentOptions[number]["id"];

//settings
export interface Settings {
    name: string
    theme: Theme
    wallpaper: "default" | string
    blur: BlurSize
    widgets: WidgetSettings
    // NEW: Optional, so it doesn't break existing users' settings
    widgetPreferences?: Partial<WidgetPreferences>;
    accent: Accent
    show_top_sites: boolean
    show_favorites: boolean
}