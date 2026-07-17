import React, { forwardRef, type InputHTMLAttributes } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Field } from '@base-ui/react/field';
import { Typography } from '../common/Typography';
import { cn } from '../../lib/util';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    children?: React.ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ error, children, className, ...props }, ref) => {
        return (
            // Field.Root manages the validation state for all children
            <Field.Root invalid={!!error} className="flex flex-col gap-y-0.5 h-full">
                <div className="relative overflow-clip h-full">
                    <BaseInput
                        ref={ref}
                        {...props}
                        className={cn(
                            "border-t bg-background/50 app-blur flex-1 w-full rounded-3xl px-4 py-2 md:py-2.5 focus:ring-0 focus:outline-0 text-xs md:text-sm lg:text-base text-foreground placeholder:text-foreground",
                            "transition-colors duration-200",
                            // Base UI automatically adds 'data-invalid' to the input when Field.Root is invalid
                            "data-invalid:border-destructive data-invalid:text-destructive",
                            "border-border text-foreground",
                            className
                        )}
                    />
                    {children}
                </div>

                {/* Field.Error automatically shows/hides based on the invalid state */}
                <Field.Error match="customError" className="sr-only">
                    {/* We keep your Typography for visual rendering, but hide the native Field.Error visually 
                        and let it handle the screen-reader announcement, OR you can just use your Typography 
                        controlled by the Field state. */}
                </Field.Error>

                {/* Your existing visual error rendering */}
                {error && (
                    <Typography variant="caption-xs" className="text-destructive">
                        {error}
                    </Typography>
                )}
            </Field.Root>
        );
    }
);

TextInput.displayName = 'TextInput';
export default TextInput;