import { createContext } from "react";

export type SettingsTab =
    | "about"
    | "user-information"
    | "sites-and-shortcuts"
    | "preferences"
    | "commands"
    | "widgets-center";

export interface SettingsTabsContextValue {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

export const SettingsTabsContext =
    createContext<SettingsTabsContextValue | null>(null);