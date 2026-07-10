import { useEffect, type MouseEvent } from 'react';

import Button from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import ModalHeader from '@/components/modal/ModalHeader';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { useForm } from 'react-hook-form';
import { favoriteSchema, type FavoriteFormValues } from '../validation/favorite-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '@/components/Form/TextInput';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from 'sonner';

interface FavoriteModalProps {
    open: boolean;
    onClose: () => void;
    init_value?: {
        title: string;
        url: string
    };
    favorite_id?: number;
}

export default function FavoriteModal({ open, onClose, favorite_id, init_value }: FavoriteModalProps) {

    const { data: favorites, addItem, updateItem } = useFavorites()

    const editing = Boolean(favorite_id)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<FavoriteFormValues>({
        resolver: zodResolver(favoriteSchema),
        defaultValues: {
            title: init_value?.title ?? "",
            url: init_value?.url ?? "https://",
        },
        mode: 'onChange', // validates on change for immediate feedback
    });
    // Reset form when modal opens
    useEffect(() => {
        if (open && !editing) {
            reset({ title: '', url: "https://" });
        }
    }, [open, reset, editing]);

    const onSubmit = async (data: FavoriteFormValues) => {

        if (editing && favorite_id) {

            updateItem({ ...data, id: favorite_id })
            onClose()
            toast.success("Favorite updated!")

            return
        }

        if (favorites.length >= 10) {

            toast.info("Favorite limit reached. Maximum 10 favorites allowed.")
            onClose()
            return
        }

        addItem(data)
        onClose()
        toast.success("New favorite added!")
    };


    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                onClick={stopPropagation}
                className="app_container bg-background p-5 flex flex-col gap-4 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={`${editing ? 'Update' : 'Add'} Favorite Website`}
                    onClose={onClose}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        {...register('url')}
                        autoFocus
                        placeholder="Your url..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.url?.message} // passes error message to the custom TextInput
                    />
                    <TextInput
                        {...register('title')}
                        placeholder="Your title..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.title?.message} // passes error message to the custom TextInput
                    />

                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}

                        variant="primary-active"
                        size="sm"
                    >
                        <Typography variant="caption">{editing ? "Save" : "Add Favorite"}</Typography>
                    </Button>
                </form>
            </div>
        </ModalWrapper>
    );
}