import { Typography } from "@/components/common/Typography";
import { useMemo } from "react";
import { TABS } from "../constants/tabs";
import { useSettingsTabs } from "../hooks/useSettingsTabs";
import PreferencesTabDetails from "./tabs-details/preferences-tab-details/PreferencesTabDetails";
import UserInfoTabDetails from "./tabs-details/user-info-tab-details/UserInfoTabDetails";
import WidgetsCenterTabDetails from "./tabs-details/widgets-center/WidgetsCenterTabDetails";
import AboutTabDetails from "./tabs-details/about-tab-details/AboutTabDetails";

export default function TabDetails() {

    const { activeTab } = useSettingsTabs();

    const tab = useMemo(() => {
        return TABS.find(t => t.id === activeTab)
    }, [activeTab])

    return (
        <div className="flex flex-col gap-y-6 col-span-3 flex-1 min-h-0 app_container app_gradient app-blur py-5 px-8">

            <div className="flex-row-center gap-x-2">
                {tab?.Icon && (
                    <tab.Icon className="size-7" />
                )}
                <Typography className="capitalize" variant="h2">
                    {tab?.label}
                </Typography>
            </div>

            {activeTab === 'user-information' && (
                <UserInfoTabDetails />
            )}
            {activeTab === 'preferences' && (
                <PreferencesTabDetails />
            )}
            {activeTab === 'widgets-center' && (
                <WidgetsCenterTabDetails />
            )}
            {activeTab === 'about' && (
                <AboutTabDetails />
            )}

        </div>
    )
}
