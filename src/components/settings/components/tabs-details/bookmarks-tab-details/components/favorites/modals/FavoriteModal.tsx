import { useEffect } from 'react';

import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import TextInput from '@/components/ui/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/stores/useToastStore';
import { useFavorites } from '../hooks/useFavorites';
import { favoriteSchema, type FavoriteFormValues } from '../validation/favorite-schema';
import { normalizeUrl } from '@/lib/url';
import ExistingWebsitesPicker from '../../ExistingWebsitesPicker';

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
    const { data: favorites, addItem, updateItem } = useFavorites();

    const editing = Boolean(favorite_id);

    const {
        register,
        handleSubmit,
        reset,
        setValue, // 👈 Extracted to programmatically update fields
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<FavoriteFormValues>({
        resolver: zodResolver(favoriteSchema),
        defaultValues: {
            title: init_value?.title ?? "",
            url: init_value?.url ?? "",
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (open && !editing) {
            reset({ title: '', url: "" });
        }
    }, [open, reset, editing]);

    const onSubmit = async (data: FavoriteFormValues) => {
        const payload = {
            ...data,
            url: normalizeUrl(data.url),
        };

        if (editing && favorite_id) {
            updateItem({ ...payload, id: favorite_id });
            onClose();
            toast.success("Favorite updated!");
            return;
        }

        if (favorites.length >= 15) {
            toast.info("Favorite limit reached. Maximum 15 favorites allowed.");
            onClose();
            return;
        }

        addItem(payload);
        onClose();
        toast.success("New favorite added!");
    };

    const handleSiteSelect = (site: { title: string; url: string }) => {
        setValue('title', site.title || site.url, { shouldValidate: true, shouldDirty: true });
        setValue('url', site.url, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={`${editing ? 'Update' : 'Add'} Favorite Website`}
                    onClose={onClose}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        {...register('url')}
                        autoFocus
                        placeholder="Website URL (e.g. localhost:3000 or https://...)"
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.url?.message}
                    />
                    <TextInput
                        {...register('title')}
                        placeholder="Your title..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.title?.message}
                    />

                    {/* 👇 Pick from Existing Bookmarks & Top Sites */}
                    {!editing && (
                        <ExistingWebsitesPicker
                            onSelect={handleSiteSelect}
                            excludeUrls={favorites.map((f) => f.url)}
                            includeFavorites={false}
                            includeFolders={true}
                            includeRoutines={true}
                            includeTopSites={true}
                        />
                    )}

                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                        variant="primary-active"
                        size="sm"
                    >
                        <BetterTypography variant="sm">
                            {editing ? "Save" : "Add Favorite"}
                        </BetterTypography>
                    </Button>
                </form>
            </div>
        </ModalWrapper>
    );
}