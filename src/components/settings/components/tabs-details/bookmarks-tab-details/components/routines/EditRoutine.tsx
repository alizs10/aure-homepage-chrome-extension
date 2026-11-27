import Button from '@/components/ui/Button';
import { PenIcon } from 'lucide-react';
import { useState } from 'react';
import RoutineModal from './modals/RoutineModal';
import type { Routine } from '@/features/bookmarks';

interface EditRoutineProps {
    routine: Routine;
}

export default function EditRoutine({ routine }: EditRoutineProps) {
    const [open, setOpen] = useState(false);

    function toggle() {
        setOpen(prev => !prev);
    }

    return (
        <>
            <Button
                onClick={toggle}
                size='icon-sm'
                variant='warning'
                title="Edit routine title"
            >
                <PenIcon className='size-4' />
            </Button>

            {open && (
                <RoutineModal
                    open={open}
                    onClose={() => setOpen(false)}
                    routine_id={routine.id}
                    init_value={{
                        title: routine.title,
                        websites: routine.websites,
                    }}
                />
            )}
        </>
    );
}
