import Toggle from '@/components/ui/Toggle'
import { Typography } from '@/components/common/Typography'
import AddNewFavorite from './AddNewFavorite'
import FavoritesList from './FavoritesList'
import { useSettingsStore } from '@/stores'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

interface FormValues {
    show_top_sites: boolean
    show_favorites: boolean
}

export default function SitesAndShortcutsContent() {
    const { settings, update } = useSettingsStore()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting, isValid }
    } = useForm<FormValues>({
        defaultValues: {
            show_top_sites: settings?.show_top_sites ?? false,
            show_favorites: settings?.show_favorites ?? false,
        }
    })

    // Reset form when settings change externally
    useEffect(() => {
        reset({
            show_top_sites: settings?.show_top_sites ?? false,
            show_favorites: settings?.show_favorites ?? false,
        })
    }, [settings, reset])

    const onSubmit = async (data: FormValues) => {
        // Handle form submission - update settings
        await update(data)
        toast.success("Settings updated!")
        reset(data) // Reset form state after successful submission
    }

    return (
        <div className='h-fit flex-1 flex flex-col gap-y-2'>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-2'>

                <Controller
                    name="show_top_sites"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Toggle
                            checked={value}
                            onCheckedChange={onChange}
                            leftLabel={
                                <Typography variant="body" weight="medium">
                                    Show top sites?
                                </Typography>
                            }
                        />
                    )}
                />

                <Controller
                    name="show_favorites"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Toggle
                            checked={value}
                            onCheckedChange={onChange}
                            leftLabel={
                                <Typography variant="body" weight="medium">
                                    Show Your Favorite websites instead of top sites?
                                </Typography>
                            }
                        />
                    )}
                />

                <div className="mt-6 w-full flex justify-end">
                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                        variant="primary-active"
                        size="md"
                    >
                        <Typography variant="caption">Save Changes</Typography>
                    </Button>
                </div>
            </form>

            <div className="flex-center-between mt-4 pt-6 border-t border-border">
                <Typography variant="h3">
                    Favorites websites
                </Typography>

                <AddNewFavorite />
            </div>

            <FavoritesList />
        </div>
    )
}