import { useEffect } from 'react';
import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import TextInput from '@/components/ui/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFolders } from '../hooks/useFolders';
import { folderSchema, type FolderFormValues } from '../validation/folder-schema';
import type { Website } from '../../../types';

interface FolderModalProps {
    open: boolean;
    onClose: () => void;
    init_value?: {
        title: string;
        websites: Website[];
    };
    folder_id?: number;
}

export default function FolderModal({ open, onClose, folder_id, init_value }: FolderModalProps) {
    const { data: folders, addItem, updateItem } = useFolders();

    const editing = Boolean(folder_id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<FolderFormValues>({
        resolver: zodResolver(folderSchema),
        defaultValues: {
            title: init_value?.title ?? "",
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (open && !editing) {
            reset({ title: '' });
        }
    }, [open, reset, editing]);

    const onSubmit = async (data: FolderFormValues) => {
        if (editing && folder_id) {
            // Preserve existing websites when updating the folder title
            const folder = folders.find(f => f.id === folder_id);
            updateItem({
                ...data,
                id: folder_id,
                websites: folder?.websites ?? []
            });
            onClose();
            toast.success("Folder updated!");
            return;
        }

        if (folders.length >= 5) {
            toast.info("Folder limit reached. Maximum 5 folders allowed.");
            onClose();
            return;
        }

        addItem(data);
        onClose();
        toast.success("New folder added!");
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                className="rounded-3xl app_shadow bg-secondary p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={`${editing ? 'Update' : 'Add'} Folder`}
                    onClose={onClose}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        {...register('title')}
                        autoFocus
                        placeholder="Folder name..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.title?.message}
                    />

                    {/* 
                        NOTE: You can expand this area to manage the `websites` array.
                        Use `addWebsiteToFolder` and `removeWebsiteFromFolder` from `useFolders()` 
                        to build a UI for adding/removing websites directly inside this modal.
                    */}

                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                        variant="primary-active"
                        size="sm"
                    >
                        <BetterTypography variant="sm">
                            {editing ? "Save" : "Add Folder"}
                        </BetterTypography>
                    </Button>
                </form>
            </div>
        </ModalWrapper>
    );
}