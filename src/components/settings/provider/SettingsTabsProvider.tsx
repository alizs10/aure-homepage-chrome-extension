import { useState } from "react";
import { SettingsTabsContext, type SettingsTab } from "../context/SettingsTabsContext";


interface Props {
    children: React.ReactNode;
}



export function SettingsTabsProvider({ children }: Props) {
    const [activeTab, setActiveTab] =
        useState<SettingsTab>("user-information");

    return (
        <SettingsTabsContext.Provider
            value={{
                activeTab,
                setActiveTab
            }}
        >
            {children}
        </SettingsTabsContext.Provider>
    );
}