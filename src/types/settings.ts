export type Theme = 'dark' | 'light' | 'system'

export type Wallpaper = {
    id: string,
    name: string,
    variants: {
        light?: string,
        dark?: string,
    },
};

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

export interface Settings {
    name: string
    theme: Theme
    wallpaper: "default" | string
    blur: BlurSize
}