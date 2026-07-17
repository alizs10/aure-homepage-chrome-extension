import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import Toggle from "@/components/ui/Toggle";
import { SettingsIcon } from "lucide-react";
import { useNotesAndChecklists } from "../hooks/useNotesAndChecklists";

export default function NotesSettingsPopup() {
    // Get state and setter from the global store
    const { showChecked, setShowChecked } = useNotesAndChecklists();

    return (
        <Popup
            trigger={(props, state) => (
                <Button
                    {...props}
                    variant={state.open ? "primary-active" : "ghost"}
                    size="icon-sm"
                >
                    <SettingsIcon className="size-4" />
                </Button>
            )}
            className="py-3 px-4 min-w-40"
        >
            <div className="flex flex-col gap-y-3">
                <BetterTypography
                    variant="sm"
                    weight="medium"
                    className="border-b border-border pb-1"
                >
                    Settings
                </BetterTypography>

                <ul className="flex flex-col gap-y-1">
                    <li>
                        <Toggle
                            checked={showChecked}
                            onCheckedChange={setShowChecked} // Directly link to the store action
                            size="sm"
                            leftLabel={
                                <BetterTypography variant="xs">
                                    Display Checked Tasks
                                </BetterTypography>
                            }
                        />
                    </li>
                </ul>
            </div>
        </Popup>
    );
}