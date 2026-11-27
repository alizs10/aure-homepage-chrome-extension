import { BetterTypography } from "@/components/common/BetterTypography";
import { HostPermissionsSection } from "@/components/settings/components/tabs-details/privacy-tab-details/HostPermissionsSection";
import Toggle from "@/components/ui/Toggle";

export function PrivacyAndPermissions({
  enableIpChecker,
  onToggleIpChecker,
}: {
  enableIpChecker?: boolean;
  onToggleIpChecker: (enabled: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-y-7 w-full p-5 sm:p-7">
      {/* 1. Privacy Guarantee */}
      <div className="flex flex-col gap-y-2.5">
        <BetterTypography
          variant="xs"
          weight="semibold"
          as="h3"
          className="text-muted-foreground uppercase tracking-wider px-1"
        >
          Privacy Guarantee
        </BetterTypography>

        <div className="p-3.5 md:p-4 rounded-3xl liquid-glass flex flex-col gap-y-1">
          <BetterTypography
            variant="sm"
            weight="semibold"
            className="text-success"
          >
            Privacy-First & Completely Local
          </BetterTypography>
          <BetterTypography
            variant="xs"
            className="text-muted-foreground leading-relaxed"
          >
            Aure Homepage does not collect analytics, logs, or telemetry. All
            your bookmarks, notes, widgets, and preferences stay strictly inside
            your local browser.
          </BetterTypography>
        </div>
      </div>

      {/* 2. Optional Host Permissions */}
      <HostPermissionsSection compactHeader />

      {/* 3. Optional Public IP Checker */}
      <div className="flex flex-col gap-y-2.5">
        <BetterTypography
          variant="xs"
          weight="semibold"
          as="h3"
          className="text-muted-foreground uppercase tracking-wider px-1"
        >
          Network & IP Indicator
        </BetterTypography>

        <div className="p-3.5 md:p-4 rounded-3xl liquid-glass flex flex-col gap-y-1">
          <div className="flex-center-between gap-x-4">
            <BetterTypography variant="sm" weight="semibold">
              Public IP Address Indicator
            </BetterTypography>

            <Toggle
              checked={enableIpChecker ?? false}
              onCheckedChange={onToggleIpChecker}
              size="md"
            />
          </div>

          <BetterTypography variant="xs" className="text-muted-foreground">
            Displays your public IP address and country flag alongside the
            network status in the top bar. You can turn this on or off anytime.
          </BetterTypography>
        </div>
      </div>
    </div>
  );
}
