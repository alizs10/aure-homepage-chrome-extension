import { Tooltip } from "@base-ui/react/tooltip";
import { type ReactElement, cloneElement, type HTMLAttributes, type MouseEventHandler } from "react";
import { BetterTypography } from "@/components/common/BetterTypography";
import { sliceText } from "@/helpers";

interface ItemTooltipProps {
    title: string;
    subtitle?: string;
    children: ReactElement;
    onClick?: MouseEventHandler<HTMLElement>;
}

// 🌟 A strict type to safely capture standard HTML events + onClick
type SafeTriggerProps = HTMLAttributes<HTMLElement> & {
    onClick?: MouseEventHandler<HTMLElement>;
};

export function ItemTooltip({ title, subtitle, children, onClick }: ItemTooltipProps) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger
                delay={100}
                closeDelay={100}
                render={(props: SafeTriggerProps) => {
                    // 🌟 Cast the child to a ReactElement with our safe props type.
                    // This tells cloneElement exactly what props to expect, preventing the "unknown" error.
                    const childElement = children as ReactElement<SafeTriggerProps>;

                    return cloneElement(childElement, {
                        ...childElement.props,
                        ...props,
                        // 🌟 Merge the onClick handlers so neither is swallowed
                        onClick: (e: React.MouseEvent<HTMLElement>) => {
                            props.onClick?.(e);              // 1. Base UI's internal handler (if any)
                            childElement.props.onClick?.(e); // 2. The child Button/Link's original handler
                            onClick?.(e);                    // 3. Any explicitly passed handler to ItemTooltip
                        },
                    });
                }}
            />
            <Tooltip.Portal>
                <Tooltip.Positioner side="bottom" sideOffset={8}>
                    <Tooltip.Popup
                        className="rounded-3xl app_shadow bg-background px-4 py-2 flex flex-col rounded-2xl z-9999
                        data-closed:opacity-0 data-closed:scale-95
                        data-open:opacity-100 data-open:scale-100
                        transition-colors duration-200 origin-var(--transform-origin)"
                    >
                        <BetterTypography className="text-nowrap" variant="12-12-16" weight="semibold">
                            {sliceText(title, 25)}
                        </BetterTypography>
                        {subtitle && (
                            <BetterTypography className="text-nowrap text-muted-foreground" variant="10-10-14" as="span">
                                {sliceText(subtitle, 50)}
                            </BetterTypography>
                        )}
                    </Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}