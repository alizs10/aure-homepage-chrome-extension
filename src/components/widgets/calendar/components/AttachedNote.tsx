import { BetterTypography } from '@/components/common/BetterTypography';
import { format } from 'date-fns';
import { PenIcon, StickyNoteIcon, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../../ui/Button';
import { useCalendar } from '../hooks/useCalendar';
import CalendarNoteModal from '../modals/CalendarNoteModal';

export default function AttachedNote() {


    const { selectedDay, removeItem, data } = useCalendar();
    const [open, setOpen] = useState(false)
    function toggle() {
        setOpen(prev => !prev)
    }

    const formattedDate = useMemo(() => {

        return selectedDay ? format(selectedDay, "MMMM dd") : null;

    }, [selectedDay])

    const attachedNote = useMemo(() => {
        if (!selectedDay) return null;
        const formattedDate = format(selectedDay, "yyyy-MM-dd");
        return data.find(d => d.date === formattedDate);
    }, [selectedDay, data]);

    if (!selectedDay) return null;

    return (
        <>
            <div className="app_container bg-background px-4 py-2 group relative">
                {attachedNote ? (
                    <>
                        <BetterTypography
                            variant="sm"
                            className="line-clamp-2 wrap-break-word"
                        >
                            <StickyNoteIcon className="size-4.5 float-left mr-1 mt-0.75" />
                            {attachedNote.text}
                        </BetterTypography>

                        <div className="app_container  absolute inset-0 left-auto transition-all duration-200 w-0 group-hover:w-24 h-full flex-center gap-2 overflow-clip border-t-0!  app-blur rounded-l-none! z-20">
                            <Button
                                onClick={toggle}
                                size='icon-sm' variant='warning'>
                                <PenIcon className='size-4' />
                            </Button>
                            <Button
                                onClick={() => {
                                    removeItem(attachedNote.id)
                                    toast.success("Attached note deleted!")
                                }}
                                size='icon-sm' variant='destructive'>
                                <TrashIcon className='size-4' />
                            </Button>
                        </div>
                    </>

                ) : selectedDay ? (<BetterTypography
                    variant="sm"
                    className="line-clamp-2 wrap-break-word"
                >
                    <StickyNoteIcon className='size-4.5 float-left mr-1 mt-0.75' />
                    Attach a note for {formattedDate}
                </BetterTypography>) : null}



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
