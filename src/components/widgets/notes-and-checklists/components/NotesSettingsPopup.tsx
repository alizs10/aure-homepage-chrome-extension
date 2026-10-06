import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import Toggle from "@/components/ui/Toggle";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNotesAndChecklists } from "../hooks/useNotesAndChecklists";
import CleanupModal from "./CleanupModal";

export default function NotesSettingsPopup() {
    const { showChecked, setShowChecked } = useNotesAndChecklists();
    const [isCleanupOpen, setIsCleanupOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleCleanupClick = () => {
        setIsPopupOpen(false); // 🌟 Close the popup
        setIsCleanupOpen(true); // Open the modal
    };

    return (
        <>
            <Popup
                open={isPopupOpen}
                onOpenChange={setIsPopupOpen}
                trigger={(props) => (
                    <Button
                        {...props}
                        variant={isPopupOpen ? "primary-active" : "ghost"}
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
                                onCheckedChange={setShowChecked}
                                size="sm"
                                leftLabel={
                                    <BetterTypography variant="xs">
                                        Display Checked Tasks
                                    </BetterTypography>
                                }
                            />
                        </li>
                    </ul>

                    <div className="border-t border-border pt-2 mt-1">
                        <Button
                            variant="ghost-destructive"
                            className="w-full justify-start gap-2 h-8"
                            onClick={handleCleanupClick}
                        >
                            <TrashIcon className="size-3.5" />
                            <BetterTypography variant="xs" weight="medium">
                                Cleanup Data
                            </BetterTypography>
                        </Button>
                    </div>
                </div>
            </Popup>

            {/* Rendered outside to survive Popup unmounting */}
            <CleanupModal open={isCleanupOpen} onClose={() => setIsCleanupOpen(false)} />
        </>
    );
}