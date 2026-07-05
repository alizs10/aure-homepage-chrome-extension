import { Typography } from '@/components/common/Typography';
import { formatDate } from '@/helpers';
import { cn } from '@/lib/util';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { getMoodBgColor, getMoodIcon, getMoodTextColor } from '../constants/moods';
import { useMoodTracker } from '../hooks/useMoodTracker';
import type { MoodHistory, MoodType } from '../types';

interface MoodSquareProps {
    moodDayItem: MoodHistory;
}

export default function MoodSquare({ moodDayItem }: MoodSquareProps) {

    const { today } = useMoodTracker()

    const [isHovered, setIsHovered] = useState(false);

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
        <div className="relative">
            <div

                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}

                className={cn(
                    "border border-border col-span-1 aspect-square rounded-sm flex-center",
                    moodTextColor(history.mood),
                    moodBgColor(history.mood),
                )} />


            <AnimatePresence>
                {isHovered && (
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
                    </motion.div>
                )}
            </AnimatePresence>

        </div>


    )
}
