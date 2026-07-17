import { CircleQuestionMarkIcon } from "lucide-react";
import Button from "../../../ui/Button";
import { Typography } from "../../../common/Typography";
import Popup from "@/components/ui/Popup";

const listOfInfo = [
    { label: "Max age", value: "Cats: 10y • Dogs: 15y" },
    { label: "Time", value: "1 real day = 1 pet year" },
    { label: "Feeding", value: "Feed each pet 3x per day" },
    { label: "Death", value: "Pets can die from starvation or old age" },
];

export default function PetRulesPopup() {
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
            className="py-3 px-4 min-w-55"
        >
            <ul className="flex flex-col gap-y-2">
                {listOfInfo.map((item, index) => (
                    <li key={index}>
                        <Typography className="text-nowrap" variant="caption-xs">
                            <span className="font-medium text-muted-foreground">{item.label}:</span>{" "}
                            {item.value}
                        </Typography>
                    </li>
                ))}
            </ul>
        </Popup>
    );
}