import Button from '@/components/ui/Button';
import { GlobeIcon } from 'lucide-react';
import { useState } from 'react';
import type { Routine } from '@/features/bookmarks';
import ManageRoutineModal from './modals/ManageRoutineModal';

interface ManageRoutineProps {
    routine: Routine;
}

export default function ManageRoutine({ routine }: ManageRoutineProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size='icon-sm'
                variant='primary'
                className='hidden transition-colors duration-200 group-hover:inline-flex'
                title="Manage websites in this routine"
            >
                <GlobeIcon className='size-4' />
            </Button>

            {open && (
                <ManageRoutineModal
                    open={open}
                    onClose={() => setOpen(false)}
                    routine={routine}
                />
            )}
        </>
    );
}
