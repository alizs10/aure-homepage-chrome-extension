import { CircleQuestionMarkIcon } from "lucide-react";
import Button from "../../../ui/Button";
import { Typography } from "../../../common/Typography";
import Popup from "@/components/ui/Popup";

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
            <Typography variant="caption-xs">
                To create a checklist item, start your line with <strong>[]</strong> followed by a space.
            </Typography>
        </Popup>
    );
}