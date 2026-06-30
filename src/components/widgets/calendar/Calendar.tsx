import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";

import { Typography } from "../../common/Typography";
import { useState } from "react";
import Button from "../../common/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonClass } from "../../../lib/button-styles";

export default function Calendar() {

    const [selected, setSelected] = useState<Date>();

    return (
        <div className="col-span-1 row-span-2 p-5 container h-full flex flex-col gap-y-4">
            <Typography className="capitalize" variant="h1">
                Calendar
            </Typography>

            <div className="flex-1 min-h-0 w-full">
                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    components={{
                        Chevron: ({ orientation }) =>
                            orientation === "left" ? (
                                <ChevronLeftIcon className="size-4 text-foreground!" />
                            ) : (
                                <ChevronRightIcon className="size-4 text-foreground!" />
                            ),
                    }}
                    // components={{
                    //     PreviousMonthButton: (props) => (
                    //         <Button
                    //             {...props}
                    //             size="icon-sm"
                    //             variant="ghost"
                    //         >
                    //             <ChevronLeftIcon className="size-4" />
                    //         </Button>
                    //     ),
                    //     NextMonthButton: (props) => (
                    //         <Button
                    //             {...props}
                    //             size="icon-sm"
                    //             variant="ghost"
                    //         >
                    //             <ChevronRightIcon className="size-4" />
                    //         </Button>
                    //     ),
                    // }}
                    className="text-sm"

                    classNames={{
                        button_previous: buttonClass("ghost", "icon-sm", "!text-foreground"),
                        button_next: buttonClass("ghost", "icon-sm", "!text-foreground"),
                        selected: buttonClass("success", "icon-sm", "!text-success-foreground to-success/50"),
                        today: buttonClass("primary", "icon-sm", "!text-primary-foreground to-primary/50"),
                    }}
                />
            </div>
        </div>
    );
}