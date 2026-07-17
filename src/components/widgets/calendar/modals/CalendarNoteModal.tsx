import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Typography } from '../../../common/Typography';
import Button from '../../../ui/Button';
import TextInput from '../../../ui/TextInput';
import { useCalendar } from '../hooks/useCalendar';
import { calendarNoteSchema, type CalendarNoteFormValues } from '../validation/note-schema';

interface CalendarNoteModalProps {
    open: boolean;
    onClose: () => void;
    init_value?: string;
    note_id?: number;
}

export default function CalendarNoteModal({ open, onClose, init_value = '', note_id }: CalendarNoteModalProps) {
    const { addItem, updateItem, selectedDay } = useCalendar();

    const editing = !!note_id

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CalendarNoteFormValues>({
        resolver: zodResolver(calendarNoteSchema),
        defaultValues: { note: init_value },
        mode: 'onChange', // validates on change for immediate feedback
    });

    // Reset form when modal opens
    useEffect(() => {
        if (open && !editing) {
            reset({ note: '' });
        }
    }, [open, reset, editing]);

    function onSubmit(data: CalendarNoteFormValues) {

        if (!selectedDay) return;

        const formattedSelectedDay = format(selectedDay, "MMMM dd")

        if (editing) {
            updateItem(note_id, data.note)
            toast.success("Calendar note updated!")
        } else {
            addItem(data.note, selectedDay)
            toast.success("Note attached for " + formattedSelectedDay)
        }
        reset({ note: '' });
        onClose();
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                className="app_container bg-background p-5 flex flex-col gap-4 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader title="New Calendar Note" onClose={onClose} />

                <Typography variant="body">
                    Note for {format(selectedDay!, 'MMMM dd')}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        {...register('note')}
                        placeholder="Your note..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.note?.message} // passes error message to the custom TextInput
                    />

                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        variant="primary-active"
                        size="sm"
                    >
                        <Typography variant="caption">{editing ? "Update Note" : "Save Note"}</Typography>
                    </Button>
                </form>
            </div>
        </ModalWrapper>
    );
}