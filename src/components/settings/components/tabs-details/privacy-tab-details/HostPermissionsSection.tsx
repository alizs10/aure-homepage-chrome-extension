import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { useHostPermissions, type HostPermissionItem } from "@/lib/browser";
import { toast } from "@/stores/useToastStore";
import { ShieldIcon, ShieldOffIcon } from "lucide-react";

export function HostPermissionsSection({
  hostPermissions,
  compactHeader = false,
}: {
  hostPermissions?: ReturnType<typeof useHostPermissions>;
  compactHeader?: boolean;
} = {}) {
  const internalHostPermissions = useHostPermissions();
  const {
    allGranted,
    statusMap,
    isLoading,
    applicableItems,
    requestAll,
    requestItem,
    revokeAll,
    revokeItem,
  } = hostPermissions ?? internalHostPermissions;

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
        "These permissions were installed as required permissions in Chrome. To make them optional, reload the extension cleanly from chrome://extensions.",
      );
    } else {
      toast.warning("Failed to revoke permissions");
    }
  };

  const handleToggleItem = async (
    item: HostPermissionItem,
    checked: boolean,
  ) => {
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
          `${item.service} was installed as a required permission in Chrome and cannot be removed via the app.`,
        );
      } else {
        toast.warning(`Failed to revoke permission for ${item.service}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-2.5">
      {compactHeader ? (
        <BetterTypography
          variant="xs"
          weight="semibold"
          as="h3"
          className="text-muted-foreground uppercase tracking-wider px-1"
        >
          Host Permissions (External Network Access)
        </BetterTypography>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-y-0.5">
            <BetterTypography variant="md" weight="semibold" as="h3">
              Host Permissions (External Network Access)
            </BetterTypography>
            <BetterTypography variant="xs" className="text-muted-foreground">
              External requests are strictly limited to the services listed below
              for optional functionality.
            </BetterTypography>
          </div>
        </div>
      )}

      {/* Notice when permissions are loaded */}
      {!isLoading && (
        <div className="p-3.5 md:p-4 rounded-3xl liquid-glass flex flex-col gap-y-1">
          <div className="flex justify-between items-center w-full gap-x-2">
            <BetterTypography
              variant="sm"
              weight="semibold"
              className="text-foreground"
            >
              External Permissions Notice
            </BetterTypography>

            {allGranted ? (
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
            )}
          </div>
          <BetterTypography variant="xs" className="text-muted-foreground">
            External host permissions are optional. You can click{" "}
            <strong>Grant All Permissions</strong> to authorize them in one
            browser prompt, or toggle each service individually below.
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
                      onCheckedChange={(checked) =>
                        handleToggleItem(item, checked)
                      }
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
  );
}
