import { useMemo, useState } from 'react'
import { PlusIcon, SaveIcon, XIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import ModalHeader from '@/components/ui/modal/ModalHeader'
import ModalWrapper from '@/components/ui/modal/ModalWrapper'
import TextInput from '@/components/ui/TextInput'

import { useFolders } from '../hooks/useFolders'
import { websiteSchema, type WebsiteFormValues } from '../validation/website-schema'
import type { Folder, Website } from '../../../types'
import EditWebsite from '../EditWebsite'
import { OrderableList } from '../../../OrderableList'
// 🌟 Use absolute path to prevent relative path resolution failures

interface ManageFolderModalProps {
    open: boolean
    onClose: () => void
    folder: Folder
}

export default function ManageFolderModal({ open, onClose, folder }: ManageFolderModalProps) {
    const { addWebsiteToFolder, removeWebsiteFromFolder, updateWebsiteInFolder, sortWebsiteUp, sortWebsiteDown } = useFolders()

    const [editingWebsiteId, setEditingWebsiteId] = useState<number | null>(null)

    // 🌟 FIX 1: Wrap in useMemo to prevent a new array reference on every render
    const websites = useMemo(() => folder.websites || [], [folder.websites])

    const editingWebsite = useMemo(() =>
        websites.find(w => w.id === editingWebsiteId),
        [websites, editingWebsiteId]
    )

    const maxWebsiteOrder = useMemo(() => {
        return websites.reduce((max, w) => Math.max(max, w.order), -1)
    }, [websites])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<WebsiteFormValues>({
        resolver: zodResolver(websiteSchema),
        defaultValues: { title: '', url: 'https://' },
        mode: 'onChange',
    })

    // 🌟 FIX 2: Handle state updates directly in event handlers (No useEffect needed!)

    const handleEdit = (website: Website) => {
        setEditingWebsiteId(website.id)
        reset({ title: website.title, url: website.url })
    }

    const handleCancelEdit = () => {
        setEditingWebsiteId(null)
        reset({ title: '', url: 'https://' })
    }

    const handleClose = () => {
        handleCancelEdit() // Ensure clean state before closing
        onClose()
    }

    const onSubmit = async (data: WebsiteFormValues) => {
        if (editingWebsiteId && editingWebsite) {
            await updateWebsiteInFolder(folder.id, editingWebsiteId, {
                title: data.title,
                url: data.url,
            })
            toast.success('Website updated!')
        } else {
            await addWebsiteToFolder(folder.id, { title: data.title, url: data.url })
            toast.success('Website added to folder!')
        }
        handleCancelEdit() // Reset form and clear editing state after successful submit
    }

    return (
        <ModalWrapper className='max-w-4/5 sm:max-w-xl' open={open} onClose={handleClose}>
            <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none">
                <ModalHeader title={`Manage ${folder.title}'s Folder`} onClose={handleClose} />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pb-3 border-b border-border">
                    <BetterTypography variant="sm" weight="medium">
                        {editingWebsiteId ? 'Edit Website' : 'Add Website to Folder'}
                    </BetterTypography>

                    <div className="flex flex-col gap-2">
                        <TextInput
                            {...register('url')}
                            placeholder="Website URL..."
                            className="px-3 py-1.5 text-sm"
                            error={errors.url?.message}
                        />
                        <TextInput
                            {...register('title')}
                            placeholder="Website Title..."
                            className="px-3 py-1.5 text-sm"
                            error={errors.title?.message}
                        />
                    </div>

                    <div className="flex gap-2">
                        {editingWebsiteId && (
                            <Button
                                type="button"
                                onClick={handleCancelEdit}
                                variant="ghost"
                                size="sm"
                                leftIcon={<XIcon className="size-4" />}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={!isDirty || !isValid || isSubmitting}
                            variant="primary-active"
                            size="sm"
                            className="flex-1"
                            leftIcon={editingWebsiteId ? <SaveIcon className="size-4" /> : <PlusIcon className="size-4" />}
                        >
                            {editingWebsiteId ? 'Save Changes' : 'Add Website'}
                        </Button>


                    </div>
                </form>

                <div className="flex flex-col gap-2 pt-2">
                    <BetterTypography variant="xs" weight='medium' className="text-muted-foreground">
                        Websites ({websites.length})
                    </BetterTypography>

                    <OrderableList
                        items={websites}
                        maxOrder={maxWebsiteOrder}
                        onSortUp={(id) => sortWebsiteUp(folder.id, id)}
                        onSortDown={(id) => sortWebsiteDown(folder.id, id)}
                        onRemove={(id) => removeWebsiteFromFolder(folder.id, id)}
                        removeToastMessage="Website removed from folder!"
                        emptyMessage="No websites yet. Add one above!"
                        renderLeft={(site, i) => (
                            <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                                {i + 1}. {site.title}
                                <span className="text-muted-foreground font-normal">
                                    {` (${site.url})`}
                                </span>
                            </BetterTypography>
                        )}
                        renderRight={(site) => (
                            <EditWebsite website={site} onEdit={handleEdit} />
                        )}
                    />
                </div>
            </div>
        </ModalWrapper>
    )
}