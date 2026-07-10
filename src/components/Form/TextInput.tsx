import React, {
    forwardRef,
    type InputHTMLAttributes,
} from 'react'

import { Typography } from '../common/Typography'
import { cn } from '../../lib/util'

interface TextInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
    children?: React.ReactNode
}

const TextInput = forwardRef<
    HTMLInputElement,
    TextInputProps
>(
    (
        {
            error,
            children,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <div className="flex flex-col gap-y-0.5 h-full">
                <div className="relative overflow-clip h-full">
                    <input
                        ref={ref}
                        {...props}
                        className={cn(
                            "border-t bg-background/50 app-blur flex-1 w-full rounded-3xl px-4 py-2 md:py-2.5 focus:ring-0 focus:outline-0 text-xs md:text-sm lg:text-base text-foreground placeholder:text-foreground",
                            error ? "border-destructive text-destructive" : "border-border text-foreground",
                            className
                        )}
                    />

                    {children}
                </div>

                {error && (
                    <Typography
                        variant="caption-xs"
                        className="text-destructive"
                    >
                        {error}
                    </Typography>
                )}
            </div>
        )
    }
)

TextInput.displayName = 'TextInput'

export default TextInput