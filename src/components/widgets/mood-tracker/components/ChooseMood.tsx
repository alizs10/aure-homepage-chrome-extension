import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'
import { MOODS_OPTIONS } from '../constants/moods'
import { useMoodTracker } from '../hooks/useMoodTracker'
import { moodMessages, type MoodType } from '../types'

export default function ChooseMood() {

    const { todayMood, addItem } = useMoodTracker()

    function handleMoodSelect(mood: MoodType) {

        addItem(mood, new Date())
        toast.success(moodMessages[mood]);
    }

    if (todayMood) return null;

    return (
        <div className="flex-center flex-col gap-y-4 flex-1 min-h-0">
            <BetterTypography variant="md" weight="medium">
                How do you feel today?
            </BetterTypography>

            <div className="flex-center gap-x-2">
                {MOODS_OPTIONS.map(mood => (
                    <Button key={mood.id} className="hover:scale-125 transition-all" variant="none" size="icon" onClick={() => handleMoodSelect(mood.id)}>
                        {mood.icon}
                    </Button>
                ))}
            </div>


        </div>
    )
}
