import { BetterTypography } from "@/components/common/BetterTypography";
import { fetchIpInfo } from "@/components/features/network-status/ip.service";
import Toggle from "@/components/ui/Toggle";
import { useHostPermissions } from "@/lib/browser";
import { useSettingsStore } from "@/stores";
import { toast } from "@/stores/useToastStore";
import {
  BellIcon,
  BookmarkIcon,
  DatabaseIcon,
  GlobeIcon,
  HistoryIcon,
  TimerIcon,
} from "lucide-react";
import { HostPermissionsSection } from "./HostPermissionsSection";

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

  const hostPermissions = useHostPermissions();
  const { statusMap, applicableItems, requestItem } = hostPermissions;

  const handleToggleIpChecker = async (checked: boolean) => {
    if (checked) {
      const ipItem = applicableItems.find((item) => item.id === "ip-checker");
      if (ipItem && !statusMap[ipItem.id]) {
        const granted = await requestItem(ipItem);
        if (!granted) {
          toast.warning(
            "IP checker requires permission to query GeoJS & ipwho.is",
          );
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

  return (
    <div className="h-fit flex-1 flex flex-col gap-y-8">
      {/* 🌟 1. Privacy Guarantee */}
      <div className="p-4 rounded-2xl liquid-glass flex flex-col gap-y-1">
        <BetterTypography
          variant="sm"
          weight="semibold"
          className="text-success"
        >
          Privacy-First & Completely Local
        </BetterTypography>
        <BetterTypography variant="xs" className="text-muted-foreground">
          Aure Homepage does not contain third-party trackers, telemetry, or
          analytics. Your notes, bookmarks, settings, and personal habits remain
          entirely within your local browser storage.
        </BetterTypography>
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

            <BetterTypography variant="xs" className="text-muted-foreground">
              Displays your public IP address and country flag alongside the
              network status in the header. Default is off.
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
            Aure Homepage requests only the essential browser permissions needed
            to operate its features locally.
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
      <HostPermissionsSection hostPermissions={hostPermissions} />
    </div>
  );
}
