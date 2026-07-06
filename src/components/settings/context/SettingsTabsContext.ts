import { createContext } from "react";

export type SettingsTab =
    | "user-information"
    | "preferences"
    | "widgets-center";

export interface SettingsTabsContextValue {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

export const SettingsTabsContext =
    createContext<SettingsTabsContextValue | null>(null);