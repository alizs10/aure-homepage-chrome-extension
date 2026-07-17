import { SettingsIcon } from "lucide-react";
import Button from "../../ui/Button";
import { Typography } from "../../common/Typography";
import { TABS } from "../constants/tabs";
import { useSettingsTabs } from "../hooks/useSettingsTabs";
import ResetSettings from "./ResetSettings";



export default function Sidebar() {
    const { activeTab, setActiveTab } = useSettingsTabs();

    return (
        <div className="w-full md:col-span-1 flex-1 md:min-h-0 h-fit app_container bg-background app-blur flex flex-col  md:overflow-y-scroll scrollbar-none overflow-x-auto">
            <div className="flex-row-center gap-x-2 sticky top-0 z-10 app_gradient app-blur rounded-t-3xl  p-5">
                <SettingsIcon className="size-6" />
                <Typography className="capitalize" variant="h2">
                    Settings
                </Typography>
            </div>

            <ul className="mt-1 mb-6 flex flex-col gap-y-2 px-5">
                {TABS.map((tab) => (
                    <li key={tab.id}>
                        <Button
                            size="md"
                            variant={
                                activeTab === tab.id
                                    ? "primary-active"
                                    : "ghost"
                            }
                            className="w-full"
                            onClick={() => setActiveTab(tab.id)}
                        >

                            {/* {tab.icon} */}
                            {tab?.Icon && (
                                <tab.Icon className="size-5" />
                            )}
                            <Typography
                                className="w-full text-start capitalize"
                                variant="body"
                            >
                                {tab.label}
                            </Typography>
                        </Button>
                    </li>
                ))}
            </ul>

            <div className="mt-auto w-full p-5">
                <ResetSettings />
            </div>
        </div>
    );
}