import { BetterTypography } from "@/components/common/BetterTypography";
import { fetchIpInfo } from "@/components/features/network-status/ip.service";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import {
    useHostPermissions,
    type HostPermissionItem,
} from "@/lib/browser";
import { useSettingsStore } from "@/stores";
import { toast } from "@/stores/useToastStore";
import {
    BellIcon,
    BookmarkIcon,
    DatabaseIcon,
    GlobeIcon,
    HistoryIcon,
    ShieldCheckIcon,
    ShieldIcon,
    ShieldOffIcon,
    TimerIcon
} from "lucide-react";

const EXTENSION_PERMISSIONS = [
    {
        name: "storage",
        title: "Local Storage",
        Icon: DatabaseIcon,
        description:
            "Saves your personalized settings, bookmarks, notes, widgets, and themes locally inside your browser.",
    },
    {
        name: "topSites",
        title: "Top Sites",
        Icon: GlobeIcon,
        description:
            "Retrieves your most-visited websites to display them in the homepage Top Sites section.",
    },
    {
        name: "notifications",
        title: "Notifications",
        Icon: BellIcon,
        description:
            "Displays notifications when your Pomodoro sessions or reminders finish.",
    },
    {
        name: "alarms",
        title: "Alarms & Timers",
        Icon: TimerIcon,
        description:
            "Keeps Pomodoro intervals and scheduled reminders accurate in the background.",
    },
    {
        name: "history",
        title: "Browsing History",
        Icon: HistoryIcon,
        description:
            "Powers quick search suggestions and history navigation directly from the search bar.",
    },
    {
        name: "favicon",
        title: "Website Favicons",
        Icon: BookmarkIcon,
        description:
            "Loads website icons for your bookmarks, folders, and top sites.",
    },
];

export default function PrivacyTabDetails() {
    const { settings, update } = useSettingsStore();
    const isIpCheckerEnabled = settings?.enable_ip_checker ?? false;

    const {
        allGranted,
        statusMap,
        isLoading,
        applicableItems,
        requestAll,
        requestItem,
        revokeAll,
        revokeItem,
    } = useHostPermissions();

    const handleToggleIpChecker = async (checked: boolean) => {
        if (checked) {
            const ipItem = applicableItems.find((item) => item.id === "ip-checker");
            if (ipItem && !statusMap[ipItem.id]) {
                const granted = await requestItem(ipItem);
                if (!granted) {
                    toast.warning("IP checker requires permission to query GeoJS & ipwho.is");
                    return;
                }
            }
        }

        await update({ enable_ip_checker: checked });
        if (checked) {
            toast.success("IP checker enabled");
            // Warm up cache in background if connected
            if (navigator.onLine) {
                fetchIpInfo(false);
            }
        } else {
            toast.info("IP checker disabled");
        }
    };

    const handleGrantAll = async () => {
        const granted = await requestAll();
        if (granted) {
            toast.success("All host permissions granted!");
        } else {
            toast.info("Permissions request was cancelled or dismissed");
        }
    };

    const handleRevokeAll = async () => {
        const result = await revokeAll();
        if (result.success) {
            toast.info("All host permissions revoked");
        } else if (result.error?.toLowerCase().includes("required")) {
            toast.warning(
                "These permissions were installed as required permissions in Chrome. To make them optional, reload the extension cleanly from chrome://extensions."
            );
        } else {
            toast.warning("Failed to revoke permissions");
        }
    };

    const handleToggleItem = async (item: HostPermissionItem, checked: boolean) => {
        if (checked) {
            const granted = await requestItem(item);
            if (granted) {
                toast.success(`Permission granted for ${item.service}`);
            } else {
                toast.info(`Permission request cancelled for ${item.service}`);
            }
        } else {
            const result = await revokeItem(item);
            if (result.success) {
                toast.info(`Permission revoked for ${item.service}`);
            } else if (result.error?.toLowerCase().includes("required")) {
                toast.warning(
                    `${item.service} was installed as a required permission in Chrome and cannot be removed via the app.`
                );
            } else {
                toast.warning(`Failed to revoke permission for ${item.service}`);
            }
        }
    };

    return (
        <div className="h-fit flex-1 flex flex-col gap-y-8">
            {/* 🌟 1. Privacy Guarantee */}
            <div className="p-4 rounded-2xl liquid-glass border border-success/20 flex items-start gap-x-3">
                <ShieldCheckIcon className="size-5 text-success shrink-0 mt-0.5" />
                <div className="flex flex-col gap-y-1">
                    <BetterTypography variant="sm" weight="semibold" className="text-success">
                        Privacy-First & Completely Local
                    </BetterTypography>
                    <BetterTypography variant="xs" className="text-muted-foreground">
                        Aure Homepage does not contain third-party trackers, telemetry, or analytics. Your notes, bookmarks, settings, and personal habits remain entirely within your local browser storage.
                    </BetterTypography>
                </div>
            </div>

            {/* 🌟 2. Feature Setting: IP Checker */}
            <div className="flex flex-col gap-y-3">
                <BetterTypography variant="md" weight="semibold" as="h3">
                    Network & IP Indicator
                </BetterTypography>

                <div className="p-4 rounded-2xl liquid-glass flex flex-col gap-y-3">
                    <div className="flex flex-col gap-y-4">
                        <div className="flex-center-between gap-x-4">
                            <BetterTypography variant="sm" weight="medium">
                                Enable Public IP Address Checker
                            </BetterTypography>
                            <Toggle
                                checked={isIpCheckerEnabled}
                                onCheckedChange={handleToggleIpChecker}
                                size="md"
                            />
                        </div>

                        <BetterTypography
                            variant="xs"
                            className="text-muted-foreground"
                        >
                            Displays your public IP address and country flag alongside the network status in the header. Default is off.
                        </BetterTypography>
                    </div>
                </div>
            </div>

            {/* 🌟 3. Extension Permissions Details */}
            <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-0.5">
                    <BetterTypography variant="md" weight="semibold" as="h3">
                        Extension Permissions
                    </BetterTypography>
                    <BetterTypography variant="xs" className="text-muted-foreground">
                        Aure Homepage requests only the essential browser permissions needed to operate its features locally.
                    </BetterTypography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXTENSION_PERMISSIONS.map((perm) => (
                        <div
                            key={perm.name}
                            className="p-3.5 rounded-2xl liquid-glass flex flex-col gap-y-1.5"
                        >
                            <div className="flex-row-center gap-x-2">
                                <perm.Icon className="size-4 text-primary shrink-0" />
                                <BetterTypography variant="sm" weight="semibold">
                                    {perm.title}
                                </BetterTypography>
                            </div>
                            <BetterTypography variant="xs" className="text-muted-foreground">
                                {perm.description}
                            </BetterTypography>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🌟 4. Host Permissions Details */}
            <div className="flex flex-col gap-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-y-0.5">
                        <BetterTypography variant="md" weight="semibold" as="h3">
                            Host Permissions (External Network Access)
                        </BetterTypography>
                        <BetterTypography variant="xs" className="text-muted-foreground">
                            External requests are strictly limited to the services listed below for optional functionality.
                        </BetterTypography>
                    </div>


                </div>

                {/* Notice when permissions are missing */}
                {!isLoading && (
                    <div className="p-3.5 rounded-3xl liquid-glass flex flex-col gap-y-1">
                        <div className="flex justify-between items-center w-full gap-x-2">
                            <BetterTypography variant="sm" weight="medium" className="text-foreground">
                                External Permissions Notice
                            </BetterTypography>

                            {!isLoading && (
                                allGranted ? (
                                    <Button
                                        size="sm"
                                        variant="ghost-destructive"
                                        onClick={handleRevokeAll}
                                        leftIcon={<ShieldOffIcon className="size-3.5" />}
                                        className="w-fit shrink-0"
                                    >
                                        <BetterTypography variant="xs" weight="medium">
                                            Revoke All Permissions
                                        </BetterTypography>

                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={handleGrantAll}
                                        leftIcon={<ShieldIcon className="size-3.5" />}
                                        className="w-fit shrink-0"
                                    >
                                        <BetterTypography variant="xs" weight="medium">
                                            Grant All Permissions
                                        </BetterTypography>
                                    </Button>
                                )
                            )}
                        </div>
                        <BetterTypography variant="xs" className="text-muted-foreground">
                            External host permissions are optional. You can click <strong>Grant All Permissions</strong> to authorize them in one browser prompt, or toggle each service individually below.
                        </BetterTypography>
                    </div>
                )}

                <div className="flex flex-col gap-y-2.5">
                    {applicableItems.map((item) => {
                        const isGranted = statusMap[item.id] ?? false;

                        return (
                            <div
                                key={item.id}
                                className="p-3.5 md:p-4 rounded-3xl liquid-glass flex flex-col gap-y-1"
                            >


                                <div className="flex-center-between gap-x-2">
                                    <div className="flex-row-center gap-x-2 flex-wrap">
                                        <BetterTypography variant="sm" weight="semibold">
                                            {item.service}
                                        </BetterTypography>
                                        <span className="text-xs text-muted-foreground font-mono truncate">
                                            {item.displayHost}
                                        </span>
                                    </div>
                                    <div className="shrink-0 flex items-center">
                                        {isLoading ? (
                                            <div className="w-12 h-7 rounded-full bg-muted/40 animate-pulse" />
                                        ) : (
                                            <Toggle
                                                checked={isGranted}
                                                onCheckedChange={(checked) => handleToggleItem(item, checked)}
                                                size="md"
                                            />
                                        )}
                                    </div>
                                </div>

                                <BetterTypography variant="xs" className="text-muted-foreground">
                                    {item.description}
                                </BetterTypography>


                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
