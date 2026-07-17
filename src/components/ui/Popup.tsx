import { type ReactElement, type ReactNode } from 'react';
import { Popover } from '@base-ui/react/popover';

export interface PopupProps {
    /** 
     * Render function for the trigger element. 
     * ⚠️ CRITICAL: 
     * 1. You MUST spread `props` onto your element.
     * 2. You MUST return a single ReactElement (not a Fragment or string).
     */
    trigger: (props: React.HTMLAttributes<HTMLElement>, state: { open: boolean }) => ReactElement;

    /** The dynamic content to display inside the popup */
    children: ReactNode;

    /** Positioning: Which side of the trigger to appear on */
    side?: 'top' | 'right' | 'bottom' | 'left';

    /** Positioning: Alignment relative to the trigger */
    align?: 'start' | 'center' | 'end';

    /** Distance from the trigger in pixels */
    sideOffset?: number;

    /** Optional extra Tailwind classes for the popup container */
    className?: string;

    /** Optional callback when the popup opens or closes */
    onOpenChange?: (open: boolean) => void;
}

export default function Popup({
    trigger,
    children,
    side = 'bottom',
    align = 'end',
    sideOffset = 8,
    className,
    onOpenChange,
}: PopupProps) {
    return (
        <Popover.Root onOpenChange={onOpenChange}>
            {/* Base UI will pass the correct HTML props and state to your trigger function */}
            <Popover.Trigger render={trigger} />

            <Popover.Portal>
                <Popover.Positioner side={side} align={align} sideOffset={sideOffset}>
                    <Popover.Popup
                        className={`
                            app_container bg-background z-50 rounded-3xl border-t border-border shadow-lg
                            data-starting-style:opacity-0 data-starting-style:scale-95
                            data-open:opacity-100 data-open:scale-100
                            transition-all duration-200 origin-var(--popover-transform-origin)
                            ${className || ''}
                        `}
                    >
                        {children}
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}