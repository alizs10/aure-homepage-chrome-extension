import { BetterTypography } from "@/components/common/BetterTypography";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TABS } from "../constants/tabs";
import CheckForUpdate from "./CheckForUpdate";
import AboutTabDetails from "./tabs-details/about-tab-details/AboutTabDetails";
import PreferencesTabDetails from "./tabs-details/preferences-tab-details/PreferencesTabDetails";
import BookmarksTabDetails from "./tabs-details/bookmarks-tab-details/BookmarksTabDetails";
import UserInfoTabDetails from "./tabs-details/user-info-tab-details/UserInfoTabDetails";
import CommandsTabDetails from "./tabs-details/commands-tab-details/CommandsTabDetails";
import PrivacyTabDetails from "./tabs-details/privacy-tab-details/PrivacyTabDetails";

export default function TabDetails() {
    const [searchParams] = useSearchParams();

    const activeTab = searchParams.get("tab") || "preferences";

    const tab = useMemo(() => {
        return TABS.find(t => t.id === activeTab) || TABS[0];
    }, [activeTab]);

    return (
        <div className="flex flex-col gap-y-6 h-full flex-1 md:col-span-2 lg:col-span-2 xl:col-span-3 md:min-h-0 rounded-3xl liquid-glass px-5 py-3 md:py-5 md:px-8 overflow-y-scroll scrollbar-none">
            <div className="flex-center-between">
                <div className="flex-row-center gap-x-2">
                    {tab?.Icon && (
                        <tab.Icon className="size-4 md:size-7" />
                    )}
                    <BetterTypography
                        as="h2"
                        variant="lg"
                        className="capitalize"
                        weight="medium"
                    >
                        {tab?.label}
                    </BetterTypography>
                </div>

                {activeTab === 'about' && (
                    <CheckForUpdate />
                )}
            </div>

            {activeTab === 'user-information' && (
                <UserInfoTabDetails />
            )}
            {activeTab === 'preferences' && (
                <PreferencesTabDetails />
            )}
            {activeTab === 'bookmarks' && (
                <BookmarksTabDetails />
            )}
            {activeTab === 'commands' && (
                <CommandsTabDetails />
            )}
            {activeTab === 'privacy' && (
                <PrivacyTabDetails />
            )}
            {activeTab === 'about' && (
                <AboutTabDetails />
            )}
        </div>
    );
}