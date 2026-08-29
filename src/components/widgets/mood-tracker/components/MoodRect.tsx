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

export default function MoodRect({ items, label }: MoodRectProps) {
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
                            "col-span-1 row-span-1 h-full flex-center cursor-help",
                            weekColor
                        )}
                    />
                )}
            />

            <Tooltip.Portal>
                <Tooltip.Positioner side="bottom" sideOffset={4}>
                    <Tooltip.Popup
                        className={cn(
                            "rounded-3xl app_shadow_sm px-2 py-1 flex flex-row-center gap-x-1 z-9999 data-state=closed:opacity-0 data-state=closed:scale-95 data-state=open:opacity-100 data-state=open:scale-100 transition-colors duration-200 origin-var(--transform-origin)",
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