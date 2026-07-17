import { BetterTypography } from "@/components/common/BetterTypography";
import Popup from "@/components/ui/Popup";
import { CircleQuestionMarkIcon } from "lucide-react";
import Button from "../../../ui/Button";

export default function ChecklistInfoPopup() {
    return (
        <Popup
            trigger={(props, state) => (
                <Button
                    {...props}
                    variant={state.open ? "primary-active" : "ghost"}
                    size="icon-sm"
                >
                    <CircleQuestionMarkIcon className="size-5" />
                </Button>
            )}
            className="py-3 px-4 w-60"
        >
            <BetterTypography variant="xs">
                To create a checklist item, start your line with <strong>[]</strong> followed by a space.
            </BetterTypography>
        </Popup>
    );
}