import Button from '@/components/ui/Button';
import { ZapIcon } from 'lucide-react';
import { useState } from 'react';
import RoutineModal from './modals/RoutineModal';
import { useRoutines } from '@/features/bookmarks';

export default function AddNewRoutine() {
    const [open, setOpen] = useState(false);
    const { data: routines } = useRoutines();

    const isLimitReached = routines.length >= 5;

    function toggle() {
        setOpen(prev => !prev);
    }

    return (
        <>
            <Button
                leftIcon={<ZapIcon className="size-4" />}
                onClick={toggle}
                disabled={isLimitReached}
                title={isLimitReached ? "Maximum 5 routines reached" : "Add a new routine"}
            >
                Add Routine
            </Button>

            {open && (
                <RoutineModal
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
