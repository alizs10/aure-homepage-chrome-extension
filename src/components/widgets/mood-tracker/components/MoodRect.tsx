import { Typography } from '@/components/common/Typography';
import { cn } from '@/lib/util';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { getScoreIcon, getWeekColor } from '../constants/moods';
import { calculateMoodScore } from '../helpers/history';
import type { MoodHistory } from '../types';

interface MoodRectProps {
    items: MoodHistory[];
    label: string;
}

export default function MoodRect({ items, label }: MoodRectProps) {

    const [isHovered, setIsHovered] = useState(false);

    const score = useMemo(() => {

        return calculateMoodScore(items)

    }, [items])


    const weekColor = useMemo(() => getWeekColor(score), [score]);

    const scoreIcon = useMemo(() => getScoreIcon(score), [score]);



    // const history = moodDayItem;

    if (!history) return null;


    return (
        <div className="relative">
            <div

                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}

                className={cn(
                    "border border-border col-span-1 h-5 rounded-sm flex-center",
                    weekColor
                )} />


            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}

                        className={`flex absolute top-full mt-1 left-1/2 -translate-x-1/2 w-fit app_container ${weekColor} px-2 py-1 z-20 flex-row-center gap-x-1`}>
                        {scoreIcon}

                        <Typography className='text-nowrap' variant='caption-xs'>
                            {label}, score: {score}/5
                        </Typography>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>


    )
}
