import { forwardRef, useState } from "react";
import { cn } from "../../lib/util";

type ToggleSize = "sm" | "md" | "lg";

type ToggleProps = {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;

    disabled?: boolean;
    size?: ToggleSize;

    leftLabel?: React.ReactNode;
    rightLabel?: React.ReactNode;

    className?: string;
};

const sizeClasses: Record<
    ToggleSize,
    {
        track: string;
        thumb: string;
        translate: string;
    }
> = {
    sm: {
        track: "w-10 h-6",
        thumb: "size-4",
        translate: "translate-x-4",
    },
    md: {
        track: "w-12 h-7",
        thumb: "size-5",
        translate: "translate-x-5",
    },
    lg: {
        track: "w-14 h-8",
        thumb: "size-6",
        translate: "translate-x-6",
    },
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
    (
        {
            checked,
            defaultChecked = false,
            onCheckedChange,
            disabled,
            size = "md",
            leftLabel,
            rightLabel,
            className,
        },
        ref
    ) => {
        const [internalChecked, setInternalChecked] = useState(defaultChecked);

        const isControlled = checked !== undefined;
        const value = isControlled ? checked : internalChecked;

        const handleToggle = () => {
            if (disabled) return;

            const next = !value;

            if (!isControlled) {
                setInternalChecked(next);
            }

            onCheckedChange?.(next);
        };

        const styles = sizeClasses[size];

        return (
            <div
                className={cn(
                    "inline-flex justify-between items-center gap-3",
                    disabled && "opacity-50"
                )}
            >
                {leftLabel}

                <button
                    ref={ref}
                    type="button"
                    role="switch"
                    aria-checked={value}
                    disabled={disabled}
                    onClick={handleToggle}
                    className={cn(
                        "relative rounded-full transition-all duration-200",
                        "bg-linear-to-b from-background to-background/30",
                        "border-t border-border app-blur",
                        value &&
                        "to-primary/30 dark:to-primary/50",
                        styles.track,
                        className
                    )}
                >
                    <span
                        className={cn(
                            "absolute top-1/2 left-1 -translate-y-1/2 rounded-full bg-foreground transition-transform duration-200",
                            styles.thumb,
                            value && styles.translate
                        )}
                    />
                </button>

                {rightLabel}
            </div>
        );
    }
);

Toggle.displayName = "Toggle";

export default Toggle;