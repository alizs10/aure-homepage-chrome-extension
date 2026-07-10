import { Typography } from '@/components/common/Typography';
import { formatDate } from '@/helpers';
import useClickOutside from '@/hooks/useOutsideClick';
import { cn } from '@/lib/util';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { getMoodBgColor, getMoodIcon, getMoodTextColor } from '../constants/moods';
import { useMoodTracker } from '../hooks/useMoodTracker';
import type { MoodHistory, MoodType } from '../types';
import EditMood from './EditMood';

interface MoodSquareProps {
    moodDayItem: MoodHistory;
}

export default function MoodSquare({ moodDayItem }: MoodSquareProps) {

    const { today } = useMoodTracker()

    // const [isHovered, setIsHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);

    const containerRef = useClickOutside<HTMLDivElement>(() => {
        setPinned(false);
        setOpen(false);
    });

    // function handleMouseEnter() {
    //     if (!pinned) {
    //         setOpen(true);
    //     }
    // }

    // function handleMouseLeave() {
    //     if (!pinned) {
    //         setOpen(false);
    //     }
    // }

    function handleClick() {
        if (pinned) {
            setPinned(false);
            setOpen(false);
        } else {
            setPinned(true);
            setOpen(true);
        }
    }

    const moodTextColor = useCallback((mood: MoodType) => getMoodTextColor(mood), []);
    const moodBgColor = useCallback((mood: MoodType) => getMoodBgColor(mood), []);
    const moodIcon = useCallback((mood: MoodType) => getMoodIcon(mood), []);

    const history = moodDayItem;

    const tooltipContent = useCallback((date: string) => {

        const formattedDate = formatDate(today);

        if (formattedDate === date) return 'Today'

        return date;


    }, [today]);

    if (!history) return null;


    return (
        <div
            ref={containerRef}
            className="relative">
            <div
                role='button'
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                className={cn(
                    "border border-border col-span-1 aspect-square rounded-sm flex-center cursor-pointer",
                    moodTextColor(history.mood),
                    moodBgColor(history.mood),
                )} />


            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex absolute top-full mt-1 left-1/2 -translate-x-1/2 w-fit app_container ${moodTextColor(history.mood)} ${moodBgColor(history.mood)} px-2 py-1 z-20 flex-row-center gap-x-1`}>
                        <div className="">
                            {moodIcon(moodDayItem.mood)}
                        </div>
                        <Typography className='text-nowrap' variant='caption-xs'>
                            {tooltipContent(moodDayItem.date)}
                        </Typography>

                        <EditMood mood={moodDayItem} />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>


    )
}
