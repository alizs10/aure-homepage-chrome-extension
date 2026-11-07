import { BetterTypography } from "@/components/common/BetterTypography";
import Toggle from "@/components/ui/Toggle";
import { useSettingsStore } from "@/stores";
import { toast } from "@/stores/useToastStore";

export default function BookmarkBehaviorSection() {
  const { settings, update } = useSettingsStore();
  const openInNewTab = settings?.open_bookmarks_in_new_tab ?? false;

  const handleToggleOpenInNewTab = async (checked: boolean) => {
    await update({ open_bookmarks_in_new_tab: checked });
    toast.success(
      checked
        ? "Bookmarks will now open in a new tab"
        : "Bookmarks will now open in the current tab",
    );
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex-center-between">
        <BetterTypography variant="md" weight="semibold" as="h3">
          Bookmark Behavior
        </BetterTypography>
      </div>

      <div className="p-4 rounded-3xl liquid-glass flex flex-col gap-y-2">
        <div className="flex-center-between">
          <BetterTypography variant="sm" weight="semibold">
            Open Bookmarks in New Tab
          </BetterTypography>

          <div className="shrink-0 flex items-center">
            <Toggle
              checked={openInNewTab}
              onCheckedChange={handleToggleOpenInNewTab}
              size="md"
            />
          </div>
        </div>

        <BetterTypography variant="xs" className="text-muted-foreground">
          Open bookmarks, favorites, and folder websites in a new tab instead
          of the current tab.
        </BetterTypography>
      </div>
    </div>
  );
}
