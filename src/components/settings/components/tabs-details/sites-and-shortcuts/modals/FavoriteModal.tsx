import { useEffect, useState, type MouseEvent } from 'react';

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
import { getTopSites } from '@/lib/chrome/top-sites';

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

    const [topSites, setTopSites] = useState<chrome.topSites.MostVisitedURL[]>([]);

    useEffect(() => {
        getTopSites().then(setTopSites);
    }, []);

    const { data: favorites, addItem, updateItem } = useFavorites()

    const editing = Boolean(favorite_id)

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
            url: init_value?.url ?? "https://",
        },
        mode: 'onChange',
    });

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

    // 👇 Handle clicking a top site to fill the form
    function handleTopSiteClick(site: chrome.topSites.MostVisitedURL) {
        // shouldDirty: true ensures the "Add Favorite" button becomes enabled
        // shouldValidate: true triggers immediate validation feedback
        setValue('title', site.title || site.url, { shouldValidate: true, shouldDirty: true });
        setValue('url', site.url, { shouldValidate: true, shouldDirty: true });
    }

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
                        error={errors.url?.message}
                    />
                    <TextInput
                        {...register('title')}
                        placeholder="Your title..."
                        className="px-4 py-1 text-sm placeholder:text-sm"
                        error={errors.title?.message}
                    />

                    {/* 👇 Top Sites Selection UI */}
                    {topSites.length > 0 && !editing && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                            <Typography variant="caption-xs" className="text-muted-foreground">
                                Or choose from your Top Sites
                            </Typography>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto scrollbar-none px-1">
                                {topSites.map((site) => (
                                    <button
                                        key={site.url}
                                        type="button" // Prevents accidental form submission
                                        onClick={() => handleTopSiteClick(site)}
                                        className="app_container bg-background hover:bg-secondary transition-colors px-3 py-1.5 rounded-full flex items-center gap-2 group col-span-1"
                                    >
                                        <Typography variant="caption-xs" className="text-nowrap line-clamp-1 group-hover:text-primary transition-colors text-ellipsis">
                                            {site.title || site.url}
                                        </Typography>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

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