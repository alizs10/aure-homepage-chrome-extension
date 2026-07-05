import { CalendarPlusIcon } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../common/Button';
import CalendarNoteModal from '../modals/CalendarNoteModal';

export default function NewCalendarNote() {

    const [open, setOpen] = useState(false);


    function toggle() {
        setOpen((prev) => !prev);
    }

    return (
        <>
            <Button
                size="icon"
                className="h-full"
                variant="primary"
                onClick={toggle}
            >
                <CalendarPlusIcon className="size-4" />

            </Button>



            {open && (<CalendarNoteModal open={open} onClose={toggle} />)}

        </>
    )
}
