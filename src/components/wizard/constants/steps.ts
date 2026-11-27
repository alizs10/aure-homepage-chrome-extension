export const STEPS = [
    { id: 1, label: "Profile", title: "Profile", description: "Personalize your greeting and identity" },
    { id: 2, label: "Appearance", title: "Appearance", description: "Customize your theme, wallpaper, and styling" },
    { id: 3, label: "Search", title: "Search", description: "Select your preferred web search provider" },
    { id: 4, label: "Privacy", title: "Privacy", description: "Configure local privacy and permissions" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
