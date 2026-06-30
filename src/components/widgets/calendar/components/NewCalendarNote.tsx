import { CalendarPlusIcon } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../common/Button';
import CalendarNoteModal from '../modals/CalendarNoteModal';

interface NewCalendarNoteProps {
    selected_day: Date;
}

export default function NewCalendarNote({ selected_day }: NewCalendarNoteProps) {

    const [open, setOpen] = useState(false);


    function toggle() {
        setOpen((prev) => !prev);
    }

    return (
        <>
            <Button
                size="icon"
                className="h-full"
                onClick={toggle}
            >
                <CalendarPlusIcon className="size-4" />

            </Button>



            {open && (<CalendarNoteModal open={open} onClose={toggle} selected_day={selected_day} />)}

        </>
    )
}
