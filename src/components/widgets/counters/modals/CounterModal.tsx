import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import TextInput from '@/components/ui/TextInput';
import Toggle from '@/components/ui/Toggle';
import ColorPicker from '@/components/ui/ColorPicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCounters } from '../hooks/useCounters';
import { toast } from 'sonner';
import type { Counter, CounterColor, CounterType } from '../types';
import { accentOptions } from '@/types/settings';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { counterSchema, type CounterFormValues } from '../validation/counter-schema';
import { useTheme } from '@/hooks/useTheme';

interface CounterModalProps {
    open: boolean;
    onClose: () => void;
    counter: Counter | null;
}

export default function CounterModal({ open, onClose, counter }: CounterModalProps) {
    const { addItem, updateItem } = useCounters();
    const { resolvedTheme } = useTheme();
    const isEditing = !!counter;

    const colorOptions = useMemo(() =>
        accentOptions.map(opt => ({
            id: opt.id,
            label: opt.label,
            style: { backgroundColor: resolvedTheme === 'dark' ? opt.dark : opt.light },
            foreground: resolvedTheme === 'dark' ? opt.foreground.dark : opt.foreground.light,
        })),
        [resolvedTheme]);

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<CounterFormValues>({
        resolver: zodResolver(counterSchema),
        defaultValues: {
            name: counter?.name || "",
            type: counter?.type || "count_up",
            color: counter?.color || "default",
            // 🌟 Defaults to today silently for Count Downs
            startDate: counter?.startDate || format(new Date(), 'yyyy-MM-dd'),
            endDate: counter?.endDate || "",
            isRecurring: counter?.isRecurring || false,
            intervalDays: counter?.intervalDays || undefined,
        }
    });

    const watchType = watch("type");
    const watchIsRecurring = watch("isRecurring");

    const onSubmit = async (data: CounterFormValues) => {
        const payload = {
            name: data.name,
            type: data.type as CounterType,
            color: data.color as CounterColor,
            startDate: data.startDate,
            endDate: data.type === 'count_down' ? data.endDate : undefined,
            isRecurring: data.type === 'count_down' ? data.isRecurring : false,
            intervalDays: data.type === 'count_down' && data.isRecurring ? data.intervalDays : undefined,
        };

        if (isEditing && counter) {
            await updateItem(counter.id, payload);
            toast.success("Counter updated!");
        } else {
            await addItem(payload);
            toast.success("Counter added!");
        }
        onClose();
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-auto scrollbar-none">
                <ModalHeader title={isEditing ? "Edit Counter" : "New Counter"} onClose={onClose} />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-1.5">
                        <BetterTypography variant="xs" weight="medium">Name</BetterTypography>
                        <TextInput
                            {...register("name")}
                            placeholder="e.g., Days since last workout"
                            error={errors.name?.message as string}
                        />
                    </div>

                    <div className="flex flex-col gap-y-1.5">
                        <BetterTypography variant="xs" weight="medium">Type</BetterTypography>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <div className="flex gap-x-1 p-1 liquid-glass rounded-3xl">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={field.value === 'count_up' ? 'primary-active' : 'ghost'}
                                        onClick={() => field.onChange('count_up')}
                                        className="flex-1"
                                    >
                                        Count Up
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={field.value === 'count_down' ? 'primary-active' : 'ghost'}
                                        onClick={() => field.onChange('count_down')}
                                        className="flex-1"
                                    >
                                        Count Down
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    {/* 🌟 Count Up: Needs explicit Start Date */}
                    {watchType === 'count_up' && (
                        <div className="flex flex-col gap-y-1.5">
                            <BetterTypography variant="xs" weight="medium">Start Date</BetterTypography>
                            <TextInput type="date" {...register("startDate")} error={errors.startDate?.message as string} />
                        </div>
                    )}

                    {/* 🌟 Count Down: Only needs End Date */}
                    {watchType === 'count_down' && (
                        <div className="flex flex-col gap-y-1.5">
                            <BetterTypography variant="xs" weight="medium">End Date</BetterTypography>
                            <TextInput type="date" {...register("endDate")} error={errors.endDate?.message as string} />
                        </div>
                    )}

                    {watchType === 'count_down' && (
                        <div className="flex flex-col gap-y-3 p-3 rounded-3xl liquid-glass">
                            <div className="flex-center-between">
                                <BetterTypography variant="sm">Recurring?</BetterTypography>
                                <Controller
                                    name="isRecurring"
                                    control={control}
                                    render={({ field }) => (
                                        <Toggle
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            size="sm"
                                        />
                                    )}
                                />
                            </div>

                            {watchIsRecurring && (
                                <div className="flex flex-col gap-y-1">
                                    <BetterTypography variant="xxs" weight="medium" className="text-muted-foreground">
                                        Repeat every (days)
                                    </BetterTypography>
                                    <TextInput
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        {...register("intervalDays", {
                                            setValueAs: (v) => v === "" || v === undefined ? undefined : Number(v)
                                        })}
                                        placeholder="7"
                                        className="placeholder:text-muted-foreground"
                                        error={errors.intervalDays?.message as string}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-y-1.5">
                        <BetterTypography variant="xs" weight="medium">Color</BetterTypography>
                        <Controller
                            name="color"
                            control={control}
                            render={({ field }) => (
                                <ColorPicker
                                    options={colorOptions}
                                    selectedId={field.value}
                                    onSelect={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-x-2 mt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditing ? "Save" : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </ModalWrapper>
    );
}