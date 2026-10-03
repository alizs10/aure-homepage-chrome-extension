import { BetterTypography } from "@/components/common/BetterTypography";
import Popup from "@/components/ui/Popup";
import { CircleQuestionMarkIcon } from "lucide-react";
import Button from "../../../ui/Button";

export default function InfoPopup() {
    return (
        <Popup
            trigger={(props, state) => (
                <Button
                    {...props}
                    variant={state.open ? "primary-active" : "ghost"}
                    size="icon-sm"
                >
                    <CircleQuestionMarkIcon className="size-4" />
                </Button>
            )}
            className="py-3 px-4 w-64"
        >
            <div className="flex flex-col gap-2">
                <BetterTypography variant="xs">
                    Start any line with <strong>[]</strong> to create a task.
                </BetterTypography>
                <BetterTypography variant="xs">
                    Press <strong>Shift + Enter</strong> to write multiple lines, combining text and tasks in a single note.
                </BetterTypography>
            </div>
        </Popup>
    );
}