import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import React, { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/util";
import { BetterTypography } from "../common/BetterTypography";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    children?: React.ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ error, children, className, ...props }, ref) => {
        return (
            <Field.Root
                invalid={!!error}
                className="flex h-full flex-col gap-y-0.5"
            >
                <div className="relative h-full overflow-clip">
                    <BaseInput
                        ref={ref}
                        {...props}
                        className={cn(
                            "liquid-glass flex-1 w-full rounded-3xl px-4 py-2 md:py-2.5",
                            "text-xs md:text-sm lg:text-base text-foreground",
                            "placeholder:text-foreground",
                            "focus:outline-none focus:ring-0",
                            "data-invalid:border-destructive data-invalid:text-destructive",
                            className,
                        )}
                    />

                    {children}
                </div>

                <Field.Error match="customError" className="sr-only">
                    {/* Accessible error announcement */}
                </Field.Error>

                {error && (
                    <BetterTypography
                        variant="xs"
                        className="text-destructive"
                    >
                        {error}
                    </BetterTypography>
                )}
            </Field.Root>
        );
    },
);

TextInput.displayName = "TextInput";

export default TextInput;