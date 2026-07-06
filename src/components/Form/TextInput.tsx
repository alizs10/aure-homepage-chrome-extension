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
            <div className="flex flex-col gap-y-0.5">
                <div className="relative overflow-clip">
                    <input
                        ref={ref}
                        {...props}
                        className={cn(
                            "border-t bg-background/50 app-blur flex-1 w-full rounded-full px-4 py-2 focus:ring-0 focus:outline-0 text-base md:text-lg lg:text-xl text-foreground placeholder:text-foreground",
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