import { Field } from "@base-ui/react/field";
import React, { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/util";
import { BetterTypography } from "../common/BetterTypography";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    children?: React.ReactNode;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ error, children, className, ...props }, ref) => {
        return (
            <Field.Root
                invalid={!!error}
                className="flex flex-col gap-y-0.5 w-full"
            >
                <div className="relative w-full">
                    <textarea
                        ref={ref}
                        {...props}
                        className={cn(
                            // 🌟 Reverted to standard py padding. 
                            // The auto-scroll logic in InputSection handles the bottom sticking.
                            "liquid-glass block w-full rounded-3xl px-4 py-2 md:py-2.5",
                            "text-xs md:text-sm lg:text-base text-foreground",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-0",
                            "resize-none overflow-y-auto",
                            "data-invalid:border-destructive data-invalid:text-destructive",
                            "scrollbar-none",
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

TextArea.displayName = "TextArea";

export default TextArea;