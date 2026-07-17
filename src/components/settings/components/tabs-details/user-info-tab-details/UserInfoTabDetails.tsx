import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { useSettingsStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DataBackup from '../../DataBackup';
import { userInfoSchema, type UserInfoFormValues } from './validation/user-info-schema';

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
        toast.success("Your name updated successfully!")

    }

    useEffect(() => {
        if (settings) {
            reset({
                name: settings.name,
            });
        }
    }, [settings, reset]);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-fit">
            <form onSubmit={handleSubmit(onSubmit)} className='col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4'>

                <div className="col-span-1 flex flex-col gap-y-1">
                    <label htmlFor="name">
                        <BetterTypography variant="sm">
                            Name
                        </BetterTypography>
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
                        <BetterTypography variant="sm">
                            Save Changes
                        </BetterTypography>
                    </Button>
                </div>
            </form>

            <div className="col-span-1 lg:col-span-2 mt-4 pt-6 border-t border-border">
                <DataBackup />
            </div>


        </div>
    )
}
