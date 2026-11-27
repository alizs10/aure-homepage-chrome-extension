import { BetterTypography } from "@/components/common/BetterTypography";
import { SearchEnginePicker } from "@/components/common/SearchEnginePicker";
import Toggle from "@/components/ui/Toggle";
import { getSearchEngine } from "@/constants/searchEngines";
import { useSettingsStore } from "@/stores";
import { toast } from "@/stores/useToastStore";
import type { SearchEngineId } from "@/types";

export default function SearchTabDetails() {
  const { settings, update } = useSettingsStore();
  const currentEngineId = settings?.search_engine ?? "google";
  const openInNewTab = settings?.open_search_in_new_tab ?? false;

  const handleSelectEngine = async (id: SearchEngineId) => {
    const target = getSearchEngine(id);
    await update({ search_engine: id });
    toast.success(`Search engine set to ${target.name}`);
  };

  const handleToggleOpenInNewTab = async (checked: boolean) => {
    await update({ open_search_in_new_tab: checked });
    toast.success(
      checked
        ? "Searches will now open in a new tab"
        : "Searches will now open in the current tab",
    );
  };

  return (
    <div className="h-fit flex-1 flex flex-col gap-y-8">
      {/* 🌟 1. Header Information */}
      <BetterTypography variant="sm" className="text-muted-foreground">
        Choose the default search engine and search behavior used for web
        queries from your homepage search bar.
      </BetterTypography>

      {/* 🌟 2. Search Behavior */}
      <div className="flex flex-col gap-y-3">
        <div className="flex-center-between">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Search Behavior
          </BetterTypography>
        </div>

        <div className="p-4 rounded-3xl liquid-glass flex flex-col gap-y-2">
          <div className="flex-center-between">
            <BetterTypography variant="sm" weight="semibold">
              Open Search in New Tab
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
            Open search queries and results in a new tab instead of the current
            tab.
          </BetterTypography>
        </div>
      </div>

      {/* 🌟 3. Search Engines Grid */}
      <div className="flex flex-col gap-y-3">
        <div className="flex-center-between">
          <BetterTypography variant="md" weight="semibold" as="h3">
            Available Search Engines
          </BetterTypography>
        </div>

        <SearchEnginePicker
          selectedId={currentEngineId}
          onSelect={handleSelectEngine}
          gridClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3.5"
        />
      </div>
    </div>
  );
}
