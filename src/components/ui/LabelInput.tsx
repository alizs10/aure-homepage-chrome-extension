import { useMemo, forwardRef, type InputHTMLAttributes } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { cn } from "@/lib/util";
import { BetterTypography } from "../common/BetterTypography";

export interface LabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    error?: string;
}

const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
    ({ value, onChange, options, error, className, placeholder, ...props }, ref) => {

        // Filter options based on current input value
        const filteredOptions = useMemo(() => {
            if (!value) return options;
            return options.filter(opt =>
                opt.toLowerCase().includes(value.toLowerCase())
            );
        }, [value, options]);

        return (
            <Field.Root invalid={!!error} className="flex h-full flex-col gap-y-0.5 relative">
                <Combobox.Root
                    items={filteredOptions}
                    // Bind the text input value
                    inputValue={value}
                    onInputValueChange={(val) => onChange(val ?? "")}
                    // Bind the selected item value (same as input for free-text autocomplete)
                    value={value}
                    onValueChange={(val) => onChange(val ?? "")}
                >
                    <Combobox.Input
                        ref={ref}
                        {...props}
                        placeholder={placeholder}
                        className={cn(
                            "liquid-glass flex-1 w-full rounded-3xl px-4 py-2 md:py-2.5 text-left",
                            "text-xs md:text-sm lg:text-base text-foreground",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-0",
                            "data-invalid:border-destructive data-invalid:text-destructive",
                            className,
                        )}
                    />

                    {/* Only render the portal if there are options to show */}
                    {filteredOptions.length > 0 && (
                        <Combobox.Portal>
                            <Combobox.Positioner
                                sideOffset={4}
                                style={{ zIndex: 9999 }}
                                className="z-9999"
                            >
                                <Combobox.Popup
                                    className={cn(
                                        "rounded-3xl liquid-glass bg-background/50! p-1",
                                        "w-(--anchor-width) min-w-40",
                                        "data-starting-style:opacity-0 data-starting-style:scale-95",
                                        "data-open:opacity-100 data-open:scale-100 border-none",
                                        "transition-[opacity,transform] duration-200 origin-(--combobox-transform-origin)"
                                    )}
                                >
                                    <Combobox.List className="flex flex-col w-full max-h-48 overflow-y-auto scrollbar-hide space-y-0.5">
                                        {filteredOptions.map((opt) => (
                                            <Combobox.Item
                                                key={opt}
                                                value={opt}
                                                // 🌟 FIX: Removed the `label` prop. Base UI automatically uses the children as the accessible label.
                                                className={cn(
                                                    "flex items-center justify-start h-auto py-1.5 px-3 w-full rounded-2xl cursor-pointer",
                                                    "hover:bg-muted/60 dark:hover:bg-secondary/80 transition-colors",
                                                    "data-highlighted:bg-muted/60 dark:data-highlighted:bg-secondary/80",
                                                    "focus:outline-none select-none"
                                                )}
                                            >
                                                <BetterTypography variant="xs" weight="medium" className="truncate text-left w-full">
                                                    {opt}
                                                </BetterTypography>
                                            </Combobox.Item>
                                        ))}
                                    </Combobox.List>
                                </Combobox.Popup>
                            </Combobox.Positioner>
                        </Combobox.Portal>
                    )}
                </Combobox.Root>

                <Field.Error match="customError" className="sr-only" />
                {error && (
                    <BetterTypography variant="xs" className="text-destructive">
                        {error}
                    </BetterTypography>
                )}
            </Field.Root>
        );
    }
);

LabelInput.displayName = "LabelInput";
export default LabelInput;