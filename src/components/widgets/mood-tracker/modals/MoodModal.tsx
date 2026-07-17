import { Typography } from '@/components/common/Typography';
import { type MouseEvent } from 'react'
import { MOODS_OPTIONS } from '../constants/moods';
import Button from '@/components/ui/Button';
import { moodMessages, type MoodHistory, type MoodType } from '../types';
import { useMoodTracker } from '../hooks/useMoodTracker';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import ModalHeader from '@/components/ui/modal/ModalHeader';

interface MoodModalProps {
    open: boolean;
    onClose: () => void;
    mood: MoodHistory
}

export default function MoodModal({ open, onClose, mood }: MoodModalProps) {

    const { updateItem } = useMoodTracker()

    function handleMoodSelect(selected: MoodType) {
        updateItem(mood.id, selected)
        onClose()
        toast.success(`Mood updated: ${moodMessages[selected]}`);
        // toast.success("Mood updated!")

    }

    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }
    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                onClick={stopPropagation}
                className="app_container bg-background p-5 flex flex-col gap-4 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={"Edit Mood"}
                    onClose={onClose}
                />

                <div className="flex-center flex-col gap-y-4 pb-5">
                    <Typography variant="body" weight="semibold">
                        How did you feel {format(mood.date, "MMMM dd")}?
                    </Typography>

                    <div className="flex-center gap-x-2">
                        {MOODS_OPTIONS.map(mood => (
                            <Button key={mood.id} className="hover:scale-125" variant="none" size="icon"
                                onClick={() => handleMoodSelect(mood.id)}
                            >
                                {mood.icon}
                            </Button>
                        ))}
                    </div>


                </div>


            </div>
        </ModalWrapper>
    );
}
