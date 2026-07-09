import Button from '@/components/common/Button'
import Toggle from '@/components/common/Toggle'
import { Typography } from '@/components/common/Typography'

import calendarMockupLightImg from "@/assets/mockups/calendar-light.png"
import calendarMockupDarkImg from "@/assets/mockups/calendar-dark.png"
import notesMockupLightImg from "@/assets/mockups/notes-light.png"
import notesMockupDarkImg from "@/assets/mockups/notes-dark.png"
import petHouseMockupLightImg from "@/assets/mockups/pet-house-light.png"
import petHouseMockupDarkImg from "@/assets/mockups/pet-house-dark.png"
import moodTrackerMockupLightImg from "@/assets/mockups/mood-tracker-light.png"
import moodTrackerMockupDarkImg from "@/assets/mockups/mood-tracker-dark.png"
import { useTheme } from '@/hooks/useTheme'
import { useSettingsStore } from '@/stores'
import { useForm, Controller } from 'react-hook-form'
import { widgetsSchema, type WidgetsFormValues } from './validation/widgets-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { WidgetId } from '@/types'
import { useEffect } from 'react'
import { toast } from 'sonner'

type WidgetItem = {
    id: WidgetId;
    label: string;
    imgs: {
        light: string;
        dark: string;
    };
}

interface WidgetItemProps {
    item: WidgetItem;
    statusValue: boolean;
    onChange: () => void;
}

function WidgetItem({ item, statusValue, onChange }: WidgetItemProps) {

    const { resolvedTheme: theme } = useTheme()

    return (
        <div className="col-span-1 w-full h-full app_container bg-background overflow-clip relative">
            <img src={theme === 'light' ? item.imgs.light : item.imgs.dark} className='object-cover w-full aspect-square' />

            <div className="flex-center-between px-4 pb-3">
                <Typography className='capitalize text-nowrap' variant='body-sm' weight='medium'>
                    {item.label}
                </Typography>

                <Toggle size='sm' checked={statusValue} onCheckedChange={onChange} />

            </div>
        </div>
    )
}

const widgets: WidgetItem[] = [
    {
        id: 'calendar',
        label: 'Calendar',
        imgs: {
            light: calendarMockupLightImg,
            dark: calendarMockupDarkImg,
        }
    },
    {
        // Updated ID to match the key in defaultValues
        id: 'notes-and-checklists',
        label: 'Notes & Checklists',
        imgs: {
            light: notesMockupLightImg,
            dark: notesMockupDarkImg,
        }
    },
    {
        id: 'pet-house',
        label: 'Pet House',
        imgs: {
            light: petHouseMockupLightImg,
            dark: petHouseMockupDarkImg,
        }
    },
    {
        id: 'mood-tracker',
        label: 'Mood Tracker',
        imgs: {
            light: moodTrackerMockupLightImg,
            dark: moodTrackerMockupDarkImg,
        }
    },
]

export default function WidgetsCenterTabDetails() {

    const { settings, update } = useSettingsStore()
    const settingsWidgets = settings?.widgets;

    const {
        handleSubmit,
        control,
        reset,
        formState: { isValid, isSubmitting, isDirty },
    } = useForm<WidgetsFormValues>({
        resolver: zodResolver(widgetsSchema),
        defaultValues: {
            widgets: {
                "mood-tracker": settingsWidgets?.['mood-tracker'] ?? true,
                "calendar": settingsWidgets?.['calendar'] ?? true,
                "notes-and-checklists": settingsWidgets?.['notes-and-checklists'] ?? true,
                "pet-house": settingsWidgets?.['pet-house'] ?? true,
            }
        },
        mode: 'onChange', // validates on change for immediate feedback
    });

    const onSubmit = (data: WidgetsFormValues) => {
        update({
            widgets: { ...data.widgets }
        })
        toast.success("Widgets settings saved successfully!")
    };

    useEffect(() => {
        if (settings) {
            reset({
                widgets: settings.widgets,
            });
        }
    }, [settings, reset]);

    return (
        // Wrapped in a form tag to handle submission
        <form onSubmit={handleSubmit(onSubmit)} className="h-fit flex-1 flex flex-col gap-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {widgets.map(w => (
                    <Controller
                        key={w.id}
                        name={`widgets.${w.id}` as const}
                        control={control}
                        render={({ field }) => (
                            <WidgetItem
                                item={w}
                                statusValue={field.value as boolean}
                                onChange={() => field.onChange(!field.value)}
                            />
                        )}
                    />
                ))}
            </div>

            <div className="w-full mt-auto flex justify-end">
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
    )
}