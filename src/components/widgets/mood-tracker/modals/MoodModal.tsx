import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import { formatDisplayDate } from '@/helpers';
import { type MouseEvent } from 'react';
import { toast } from '@/stores/useToastStore';
import { MOODS_OPTIONS } from '../constants/moods';
import { useMoodTracker } from '../hooks/useMoodTracker';
import { moodMessages, type MoodHistory, type MoodType } from '../types';

interface MoodModalProps {
    open: boolean;
    onClose: () => void;
    mood?: MoodHistory;
    date?: Date | string;
}

export default function MoodModal({ open, onClose, mood, date }: MoodModalProps) {
    const { updateItem, addItem } = useMoodTracker();

    const targetDate = mood ? mood.date : (date || new Date());
    const displayDate = formatDisplayDate(targetDate, "MMMM dd");
    const isEdit = Boolean(mood);

    function handleMoodSelect(selected: MoodType) {
        if (mood) {
            updateItem(mood.id, selected);
            toast.success(`Mood updated: ${moodMessages[selected]}`);
        } else {
            addItem(selected, targetDate);
            toast.success(moodMessages[selected]);
        }
        onClose();
    }

    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                onClick={stopPropagation}
                className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={isEdit ? "Edit Mood" : "Log Mood"}
                    onClose={onClose}
                />

                <div className="flex-center flex-col gap-y-4 pb-5">
                    <BetterTypography variant="md" weight="medium">
                        How did you feel {displayDate}?
                    </BetterTypography>

                    <div className="flex-center gap-x-2">
                        {MOODS_OPTIONS.map(option => (
                            <Button
                                key={option.id}
                                className="hover:scale-125"
                                variant="none"
                                size="icon"
                                onClick={() => handleMoodSelect(option.id)}
                            >
                                {option.icon}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}
