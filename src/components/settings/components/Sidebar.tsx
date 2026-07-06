import { RotateCcwIcon, SettingsIcon } from "lucide-react";
import Button from "../../common/Button";
import { Typography } from "../../common/Typography";
import { TABS } from "../constants/tabs";
import { useSettingsTabs } from "../hooks/useSettingsTabs";
import { useSettingsStore } from "@/stores";



export default function Sidebar() {
    const { clear } = useSettingsStore()
    const { activeTab, setActiveTab } = useSettingsTabs();

    return (
        <div className="col-span-1 flex-1 min-h-0 app_container app_gradient app-blur p-5 flex flex-col">
            <div className="flex-row-center gap-x-2">
                <SettingsIcon className="size-6" />
                <Typography className="capitalize" variant="h2">
                    Settings
                </Typography>
            </div>

            <ul className="mt-10 flex flex-col gap-y-2">
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

            <div className="mt-auto w-full">
                <Button
                    onClick={clear}
                    // type="submit"
                    // disabled={!isDirty || !isValid || isSubmitting}
                    className="w-full"
                    variant="destructive"
                    size="md"
                >
                    <RotateCcwIcon className="size-5" />
                    <Typography className="w-full text-start" variant="caption">Reset Settings</Typography>
                </Button>
            </div>
        </div>
    );
}