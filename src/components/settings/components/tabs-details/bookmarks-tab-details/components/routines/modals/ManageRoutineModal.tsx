import { useMemo, useState } from 'react';
import { PlusIcon, SaveIcon, XIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/stores/useToastStore';

import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import TextInput from '@/components/ui/TextInput';

import { useRoutines } from '@/features/bookmarks';
import { websiteSchema, type WebsiteFormValues } from '../../folders/validation/website-schema';
import { normalizeUrl } from '@/lib/url';
import type { Routine, Website } from '@/features/bookmarks';
import EditWebsite from '../../folders/EditWebsite';
import { OrderableList } from '../../../OrderableList';
import ExistingWebsitesPicker from '../../ExistingWebsitesPicker';

interface ManageRoutineModalProps {
    open: boolean;
    onClose: () => void;
    routine: Routine;
}

export default function ManageRoutineModal({ open, onClose, routine }: ManageRoutineModalProps) {
    const {
        addWebsiteToRoutine,
        removeWebsiteFromRoutine,
        updateWebsiteInRoutine,
        sortWebsiteUp,
        sortWebsiteDown
    } = useRoutines();

    const [editingWebsiteId, setEditingWebsiteId] = useState<number | null>(null);

    const websites = useMemo(() => routine.websites || [], [routine.websites]);

    const editingWebsite = useMemo(() =>
        websites.find(w => w.id === editingWebsiteId),
        [websites, editingWebsiteId]
    );

    const isLimitReached = websites.length >= 5;

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        setValue,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<WebsiteFormValues>({
        resolver: zodResolver(websiteSchema),
        defaultValues: { title: '', url: '' },
        mode: 'onChange',
    });

    const handleEdit = (website: Website) => {
        setEditingWebsiteId(website.id);
        reset({ title: website.title, url: website.url });
    };

    const handleCancelEdit = () => {
        setEditingWebsiteId(null);
        reset({ title: '', url: '' });
    };

    const handleClose = () => {
        handleCancelEdit();
        onClose();
    };

    const handleSiteSelect = (site: { title: string; url: string }) => {
        setValue('title', site.title || site.url, { shouldValidate: true, shouldDirty: true });
        setValue('url', site.url, { shouldValidate: true, shouldDirty: true });
    };

    const onSubmit = async (data: WebsiteFormValues) => {
        const payload = {
            title: data.title,
            url: normalizeUrl(data.url),
        };
        if (editingWebsiteId && editingWebsite) {
            await updateWebsiteInRoutine(routine.id, editingWebsiteId, payload);
            toast.success('Website updated!');
            handleCancelEdit();
        } else {
            if (isLimitReached) {
                toast.info('Maximum 5 websites allowed per routine.');
                return;
            }
            const success = await addWebsiteToRoutine(routine.id, payload);
            if (success) {
                toast.success('Website added to routine!');
                handleCancelEdit();
                if (websites.length + 1 < 5) {
                    setTimeout(() => setFocus('url'), 50);
                }
            } else {
                toast.error('Limit reached. Maximum 5 websites allowed.');
            }
        }
    };

    return (
        <ModalWrapper className='max-w-4/5 sm:max-w-xl' open={open} onClose={handleClose}>
            <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none">
                <ModalHeader
                    title={`Manage ${routine.title}`}
                    onClose={handleClose}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pb-3 border-b border-border">
                    <div className="flex-center-between">
                        <BetterTypography variant="sm" weight="medium">
                            {editingWebsiteId ? 'Edit Website' : 'Add Website to Routine'}
                        </BetterTypography>
                        <BetterTypography variant="xs" className="text-muted-foreground">
                            {`${websites.length}/5 websites`}
                        </BetterTypography>
                    </div>

                    <div className="flex flex-col gap-2">
                        <TextInput
                            {...register('url')}
                            autoFocus
                            placeholder="Website URL (e.g. localhost:3000 or https://...)"
                            className="px-3 py-1.5 text-sm"
                            error={errors.url?.message}
                            disabled={!editingWebsiteId && isLimitReached}
                        />
                        <TextInput
                            {...register('title')}
                            placeholder="Website Title..."
                            className="px-3 py-1.5 text-sm"
                            error={errors.title?.message}
                            disabled={!editingWebsiteId && isLimitReached}
                        />
                    </div>

                    {!editingWebsiteId && !isLimitReached && (
                        <ExistingWebsitesPicker
                            onSelect={handleSiteSelect}
                            excludeUrls={websites.map((w) => w.url)}
                            excludeRoutineId={routine.id}
                            includeFavorites={true}
                            includeFolders={true}
                            includeRoutines={true}
                            includeTopSites={true}
                        />
                    )}

                    {isLimitReached && !editingWebsiteId && (
                        <BetterTypography variant="xs" className="text-amber-500 font-medium">
                            Routine limit reached. A routine can hold up to 5 websites.
                        </BetterTypography>
                    )}

                    <div className="flex justify-end gap-2">
                        {editingWebsiteId && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleCancelEdit}
                                leftIcon={<XIcon className="size-4" />}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size="sm"
                            disabled={(!editingWebsiteId && isLimitReached) || !isDirty || !isValid || isSubmitting}
                            leftIcon={editingWebsiteId ? <SaveIcon className="size-4" /> : <PlusIcon className="size-4" />}
                        >
                            {editingWebsiteId ? 'Update Website' : 'Add Website'}
                        </Button>
                    </div>
                </form>

                <div className="flex flex-col gap-2">
                    <BetterTypography variant="sm" weight="medium">
                        Websites in Routine
                    </BetterTypography>

                    <OrderableList
                        items={websites}
                        onSortUp={(websiteId) => sortWebsiteUp(routine.id, websiteId)}
                        onSortDown={(websiteId) => sortWebsiteDown(routine.id, websiteId)}
                        onRemove={(websiteId) => removeWebsiteFromRoutine(routine.id, websiteId)}
                        removeToastMessage="Website removed from routine!"
                        emptyMessage="No websites added yet. Add up to 5 websites above."
                        renderLeft={(item, index) => (
                            <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                                {index + 1}. {item.title}
                                <span className="text-muted-foreground font-normal ml-1">
                                    ({item.url})
                                </span>
                            </BetterTypography>
                        )}
                        renderRight={(item) => (
                            <EditWebsite
                                website={item}
                                onEdit={handleEdit}
                            />
                        )}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
}
