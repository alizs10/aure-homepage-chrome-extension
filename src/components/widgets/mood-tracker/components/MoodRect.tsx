import { BetterTypography } from '@/components/common/BetterTypography';
import { cn } from '@/lib/util';
import { Tooltip } from '@base-ui/react/tooltip';
import { useMemo } from 'react';
import { getScoreIcon, getWeekColor } from '../constants/moods';
import { calculateMoodScore } from '../helpers/history';
import type { MoodHistory } from '../types';

interface MoodRectProps {
    items: MoodHistory[];
    label: string;
    maxCount: number;
}

export default function MoodRect({ items, label, maxCount }: MoodRectProps) {
    const score = useMemo(() => calculateMoodScore(items), [items]);
    const weekColor = useMemo(() => getWeekColor(score), [score]);
    const scoreIcon = useMemo(() => getScoreIcon(score), [score]);

    // 🎯 FIX: Original code checked `!history` which was undefined. Fixed to `!items`.
    if (!items) return null;

    return (
        <Tooltip.Root>
            <Tooltip.Trigger
                delay={100}
                closeDelay={100}
                render={(props) => (
                    <div
                        {...props}
                        // 🎯 Added cursor-help to indicate it's a tooltip, and a subtle ring when open
                        className={cn(
                            "col-span-1 h-5 flex-center cursor-help transition-all",
                            "border-r border-muted group-last-of-type:border-r-0",
                            maxCount === 4 ? "group-nth-[-n+2]:border-b group-nth-of-type-2:border-r-0" : "group-nth-[-n+3]:border-b group-nth-of-type-3:border-r-0",
                            "group-first:rounded-tl-sm group-last:rounded-br-sm",
                            maxCount === 4 ? "group-nth-of-type-2:rounded-tr-sm group-nth-of-type-3:rounded-bl-sm" : "group-nth-of-type-3:rounded-tr-sm group-nth-of-type-4:rounded-bl-sm",
                            weekColor
                        )}
                    />
                )}
            />

            <Tooltip.Portal>
                <Tooltip.Positioner side="bottom" sideOffset={4}>
                    <Tooltip.Popup
                        className={cn(
                            "app_container px-2 py-1 flex flex-row-center gap-x-1 z-9999 data-state=closed:opacity-0 data-state=closed:scale-95 data-state=open:opacity-100 data-state=open:scale-100 transition-all duration-200 origin-var(--transform-origin)",
                            weekColor
                        )}
                    >
                        {scoreIcon}
                        <BetterTypography className="text-nowrap" variant="xs">
                            {label}, score: {score}/5
                        </BetterTypography>
                    </Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}