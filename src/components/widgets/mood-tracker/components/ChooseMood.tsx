import { Typography } from '@/components/common/Typography'
import { MOODS_OPTIONS } from '../constants/moods'
import Button from '@/components/common/Button'
import { useMoodTracker } from '../hooks/useMoodTracker'
import { moodMessages, type MoodType } from '../types'
import { toast } from 'sonner'

export default function ChooseMood() {

    const { todayMood, today, addItem } = useMoodTracker()

    function handleMoodSelect(mood: MoodType) {

        addItem(mood, today)
        toast.success(moodMessages[mood]);
    }

    if (todayMood) return null;

    return (
        <div className="flex-center flex-col gap-y-4 flex-1 min-h-0">
            <Typography variant="body" weight="semibold">
                How do you feel today?
            </Typography>

            <div className="flex-center gap-x-2">
                {MOODS_OPTIONS.map(mood => (
                    <Button key={mood.id} className="hover:scale-125" variant="none" size="icon" onClick={() => handleMoodSelect(mood.id)}>
                        {mood.icon}
                    </Button>
                ))}
            </div>


        </div>
    )
}
