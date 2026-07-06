import { useContext } from "react";
import { SettingsTabsContext } from "../context/SettingsTabsContext";

export function useSettingsTabs() {
    const context = useContext(SettingsTabsContext);

    if (!context) {
        throw new Error(
            "useSettingsTabs must be used within a SettingsTabsProvider"
        );
    }

    return context;
}