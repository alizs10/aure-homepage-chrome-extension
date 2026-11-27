import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import TextInput from '@/components/ui/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/stores/useToastStore';
import { useRoutines } from '@/features/bookmarks';
import { routineSchema, type RoutineFormValues } from '../validation/routine-schema';
import type { Website } from '@/features/bookmarks';

interface RoutineModalProps {
    open: boolean;
    onClose: () => void;
    init_value?: {
        title: string;
        websites: Website[];
    };
    routine_id?: number;
}

export default function RoutineModal({ open, onClose, routine_id, init_value }: RoutineModalProps) {
    const { data: routines, addItem, updateItem } = useRoutines();

    const editing = Boolean(routine_id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<RoutineFormValues>({
        resolver: zodResolver(routineSchema),
        defaultValues: {
            title: init_value?.title ?? "",
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (open && !editing) {
            reset({ title: '' });
        } else if (open && editing && init_value) {
            reset({ title: init_value.title });
        }
    }, [open, reset, editing, init_value]);

    const onSubmit = async (data: RoutineFormValues) => {
        if (editing && routine_id) {
            const routine = routines.find(f => f.id === routine_id);
            await updateItem({
                ...data,
                id: routine_id,
                websites: routine?.websites ?? []
            });
            onClose();
            toast.success("Routine updated!");
            return;
        }

        if (routines.length >= 5) {
            toast.info("Routine limit reached. Maximum 5 routines allowed.");
            onClose();
            return;
        }

        const success = await addItem(data);
        if (success) {
            toast.success("New routine added!");
        } else {
            toast.error("Could not add routine. Maximum 5 routines allowed.");
        }
        onClose();
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={`${editing ? 'Update' : 'Add'} Routine`}
                    onClose={onClose}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        {...register('title')}
                        autoFocus
                        placeholder="Routine name (e.g., Morning Work)..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.title?.message}
                    />

                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                        className="w-full mt-2"
                    >
                        {editing ? 'Save Changes' : 'Create Routine'}
                    </Button>
                </form>
            </div>
        </ModalWrapper>
    );
}
