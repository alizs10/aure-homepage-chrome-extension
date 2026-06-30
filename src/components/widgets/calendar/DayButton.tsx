import type { DayButtonProps } from "react-day-picker";
import Button from "../../common/Button";
import { cn } from "../../../lib/util";
import { useMemo } from "react";
import { useCalendar } from "./hooks/useCalendar";

export default function DayButton(props: DayButtonProps) {

    const { getNoteForDay } = useCalendar()

    const {
        day,
        modifiers,
        children,
        className,
        ...buttonProps
    } = props;

    const variant =
        modifiers.selected
            ? "success-active"
            : modifiers.today
                ? "primary-active"
                : "ghost";

    const hasAttachedNote = useMemo(() => {
        return getNoteForDay(day.date);
    }, [day.date, getNoteForDay]);

    return (
        <Button
            {...buttonProps}
            variant={variant}
            size="icon"
            className={cn(
                className,
                "relative"
            )}
        >
            {children}

            {hasAttachedNote && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
            )}
        </Button>
    );
}