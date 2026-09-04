import { BetterTypography } from "@/components/common/BetterTypography";
import { SettingsIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Button from "../../ui/Button";
import { TABS } from "../constants/tabs";
import ResetSettings from "./ResetSettings";

export default function Sidebar() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 🌟 Read from URL, default to 'preferences'
    const activeTab = searchParams.get("tab") || "preferences";

    const setActiveTab = (tabId: string) => {
        setSearchParams({ tab: tabId }, { replace: true });
    };

    return (
        <div className="w-full md:col-span-1 flex-1 md:min-h-0 rounded-3xl liquid-glass flex flex-col md:overflow-y-scroll scrollbar-none overflow-x-auto">
            <div className="flex-row-center gap-x-2 z-10 rounded-t-3xl px-5 py-3 md:py-5 md:px-8">
                <SettingsIcon className="size-4 md:size-6" />
                <BetterTypography
                    as="h2"
                    className="capitalize"
                    variant="md"
                    weight="semibold"
                >
                    Settings
                </BetterTypography>
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
                            {tab?.Icon && (
                                <tab.Icon className="size-5 min-w-5" />
                            )}
                            <BetterTypography
                                className="w-full text-start text-nowrap text-ellipsis overflow-x-hidden"
                                variant="sm"
                            >
                                {tab.label}
                            </BetterTypography>
                        </Button>
                    </li>
                ))}
            </ul>

            <div className="mt-auto w-full p-3 md:p-5">
                <ResetSettings />
            </div>
        </div>
    );
}