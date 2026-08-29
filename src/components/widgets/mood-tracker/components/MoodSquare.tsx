import { BetterTypography } from '@/components/common/BetterTypography';
import { cn } from '@/lib/util';
import { Popover } from '@base-ui/react/popover'; // 🎯 Using Popover for interactive content
import { useCallback, useState } from 'react';
import { getMoodBgColor, getMoodIcon, getMoodTextColor } from '../constants/moods';
import { useMoodTracker } from '../hooks/useMoodTracker';
import type { MoodHistory, MoodType } from '../types';
import EditMood from './EditMood';

interface MoodSquareProps {
    moodDayItem: MoodHistory;
}

export default function MoodSquare({ moodDayItem }: MoodSquareProps) {
    const { todayStr } = useMoodTracker();

    // 🎯 We keep `open` state to allow the "click to pin" behavior
    const [open, setOpen] = useState(false);

    const moodTextColor = useCallback((mood: MoodType) => getMoodTextColor(mood), []);
    const moodBgColor = useCallback((mood: MoodType) => getMoodBgColor(mood), []);
    const moodIcon = useCallback((mood: MoodType) => getMoodIcon(mood), []);

    const tooltipContent = useCallback((date: string) => {
        return todayStr === date ? 'Today' : date;
    }, [todayStr]);

    if (!moodDayItem) return null;

    return (
        // 🎯 Popover.Root natively handles click-outside-to-close and Escape key
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
                render={(props) => (
                    <div
                        {...props}
                        role="button"
                        tabIndex={0} // 🎯 Makes the div focusable for keyboard users
                        className={cn(
                            "col-span-1 row-span-1 h-full flex-center cursor-pointer outline-none",
                            moodTextColor(moodDayItem.mood),
                            moodBgColor(moodDayItem.mood),
                        )}
                    />
                )}
            />

            <Popover.Portal>
                <Popover.Positioner side="bottom" sideOffset={4}>
                    <Popover.Popup
                        className={`flex rounded-3xl app_shadow px-2 py-1 z-9999 flex-row-center gap-x-1
                        data-state=closed:opacity-0 data-state=closed:scale-95
                        data-state=open:opacity-100 data-state=open:scale-100
                        transition-colors duration-200 origin-var(--transform-origin)
                        ${moodTextColor(moodDayItem.mood)} ${moodBgColor(moodDayItem.mood)}`}
                    >
                        <div className="shrink-0">
                            {moodIcon(moodDayItem.mood)}
                        </div>
                        <BetterTypography className="text-nowrap" variant="xs">
                            {tooltipContent(moodDayItem.date)}
                        </BetterTypography>

                        {/* 🎯 Interactive element is now safely inside a Popover, not a Tooltip */}
                        <EditMood mood={moodDayItem} />
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}