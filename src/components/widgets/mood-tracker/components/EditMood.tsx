import Button from '@/components/ui/Button';
import { PenIcon } from 'lucide-react';
import { useState } from 'react';
import MoodModal from '../modals/MoodModal';
import type { MoodHistory } from '../types';

interface EditMoodProps {
    mood: MoodHistory;
}

export default function EditMood({ mood }: EditMoodProps) {
    const [open, setOpen] = useState(false);

    function toggle() {
        setOpen(prev => !prev);
    }

    return (
        <>
            <Button
                onClick={toggle}
                className='ml-2'
                variant='primary'
                size='icon-xs'
                title='Edit mood'
            >
                <PenIcon className='size-3' />
            </Button>

            {open && (
                <MoodModal
                    open={open}
                    onClose={() => setOpen(false)}
                    mood={mood}
                />
            )}
        </>
    );
}
