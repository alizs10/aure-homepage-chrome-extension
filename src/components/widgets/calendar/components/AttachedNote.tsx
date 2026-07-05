import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Typography } from '../../../common/Typography';
import { useCalendar } from '../hooks/useCalendar';
import { PenIcon, StickyNoteIcon, TrashIcon } from 'lucide-react';
import Button from '../../../common/Button';
import CalendarNoteModal from '../modals/CalendarNoteModal';

export default function AttachedNote() {


    const { selectedDay, getNoteForDay, removeItem } = useCalendar()
    const [open, setOpen] = useState(false)
    function toggle() {
        setOpen(prev => !prev)
    }

    const formattedDate = useMemo(() => {

        return selectedDay ? format(selectedDay, "MMMM dd") : null;

    }, [selectedDay])

    const attachedNote = useMemo(() => {

        return selectedDay ? getNoteForDay(selectedDay) : null;

    }, [selectedDay, getNoteForDay])

    if (!selectedDay) return null;

    return (
        <>
            <div className="app_container bg-background px-4 py-2 group relative">
                {attachedNote ? (
                    <>
                        <Typography className='line-clamp-2 wrap-break-word' variant="body">
                            <StickyNoteIcon className='size-4.5 float-left mr-1 mt-0.75' />
                            {attachedNote.text}
                        </Typography>

                        <div className="app_container  absolute inset-0 left-auto transition-all duration-200 w-0 group-hover:w-24 h-full flex-center gap-2 overflow-clip border-t-0!  backdrop-blur-md rounded-l-none! z-20">
                            <Button
                                onClick={toggle}
                                size='icon-sm' variant='warning'>
                                <PenIcon className='size-4' />
                            </Button>
                            <Button
                                onClick={() => removeItem(attachedNote.id)}
                                size='icon-sm' variant='destructive'>
                                <TrashIcon className='size-4' />
                            </Button>
                        </div>
                    </>

                ) : selectedDay ? (<Typography variant="body">
                    <StickyNoteIcon className='size-4.5 float-left mr-1 mt-0.75' />
                    Attach a note for {formattedDate}
                </Typography>) : null}



            </div>

            {open && <CalendarNoteModal
                onClose={toggle}
                open={open}
                init_value={attachedNote?.text}
                note_id={attachedNote?.id}
            />}
        </>
    );

}
