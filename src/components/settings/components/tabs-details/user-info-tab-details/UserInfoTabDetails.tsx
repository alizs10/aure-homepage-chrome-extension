import TextInput from '@/components/Form/TextInput';
import Button from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import { useSettingsStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userInfoSchema, type UserInfoFormValues } from './validation/user-info-schema';
import { useEffect } from 'react';

export default function UserInfoTabDetails() {

    const { settings, update } = useSettingsStore()



    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useForm<UserInfoFormValues>({
        resolver: zodResolver(userInfoSchema),
        defaultValues: { name: settings?.name ?? '' },
        mode: 'onChange', // validates on change for immediate feedback
    });

    async function onSubmit(data: UserInfoFormValues) {

        update({
            name: data.name
        })

    }

    useEffect(() => {
        if (settings) {
            reset({
                name: settings.name,
            });
        }
    }, [settings, reset]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-fit flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-1">
                <label htmlFor="name">
                    <Typography variant='label'>
                        Name
                    </Typography>
                </label>
                <TextInput
                    {...register('name')}
                    placeholder="Your name..."
                    className=""
                    error={errors.name?.message} // passes error message to the custom TextInput
                />
            </div>

            <div className="col-span-2 mt-auto flex justify-end">
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
