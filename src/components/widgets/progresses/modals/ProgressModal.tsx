import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import LabelInput from '@/components/ui/LabelInput';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import TextInput from '@/components/ui/TextInput';
import ColorPicker from '@/components/ui/ColorPicker';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProgresses } from '../hooks/useProgresses';
import { toast } from 'sonner';
import type { Progress, Priority, ProgressColor, InteractionMode } from '../types';
import { accentOptions } from '@/types/settings';
import { useMemo } from 'react';
import { progressSchema, type ProgressFormValues } from '../validation/progress-schema';
import { useTheme } from '@/hooks/useTheme';
import { PlusIcon, Trash2Icon } from 'lucide-react';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);

const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
] as const;

interface ProgressModalProps {
    open: boolean;
    onClose: () => void;
    progress: Progress | null;
}

export default function ProgressModal({ open, onClose, progress }: ProgressModalProps) {
    const { addItem, updateItem, labels } = useProgresses();
    const { resolvedTheme } = useTheme();
    const isEditing = !!progress;

    const colorOptions = useMemo(() =>
        accentOptions.map(opt => ({
            id: opt.id,
            label: opt.label,
            style: { backgroundColor: resolvedTheme === 'dark' ? opt.dark : opt.light },
            foreground: resolvedTheme === 'dark' ? opt.foreground.dark : opt.foreground.light,
        })),
        [resolvedTheme]);

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<ProgressFormValues>({
        resolver: zodResolver(progressSchema),
        defaultValues: {
            title: progress?.title || "",
            label: progress?.label || "",
            priority: progress?.priority || "medium",
            deadline: progress?.deadline || "",
            color: progress?.color || "default",
            interactionMode: progress?.interactionMode || "linear",
            steps: progress?.steps.map(s => ({ id: s.id, content: s.content })) || [],
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "steps" });
    const watchInteractionMode = watch("interactionMode");

    // 🌟 Auto-focus newly added steps
    const handleAddStep = () => {
        append({ id: generateId(), content: "" });
        const newIndex = fields.length;
        setTimeout(() => {
            const el = document.getElementById(`step-input-${newIndex}`);
            el?.focus();
        }, 0);
    };

    const onSubmit = async (data: ProgressFormValues) => {
        // Map steps and trim content safely without failing validation
        const validSteps = data.steps.map(s => ({
            id: s.id,
            content: s.content.trim(),
            completed: progress?.steps.find(ps => ps.id === s.id)?.completed || false,
        }));

        const payload = {
            title: data.title,
            label: data.label,
            priority: data.priority as Priority,
            deadline: data.deadline === "" ? undefined : data.deadline,
            color: data.color as ProgressColor,
            interactionMode: data.interactionMode as InteractionMode,
            steps: validSteps,
            activeStepIndex: progress ? Math.min(progress.activeStepIndex, validSteps.length > 0 ? validSteps.length - 1 : 0) : 0,
            completed: progress ? progress.completed : false,
        };

        if (isEditing && progress) {
            await updateItem(progress.id, payload);
            toast.success("Progress updated!");
        } else {
            await addItem(payload);
            toast.success("Progress added!");
        }
        onClose();
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[85vh] overflow-y-auto scrollbar-none">
                <ModalHeader title={isEditing ? "Edit Progress" : "New Progress"} onClose={onClose} />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">

                    {/* 🌟 Section 1: Details */}
                    <div className="flex flex-col gap-y-4">

                        <div className="flex flex-col gap-y-1.5">
                            <BetterTypography variant="xs" weight="medium">Title</BetterTypography>
                            <TextInput {...register("title")} placeholder="e.g., Launch Website" error={errors.title?.message as string} />
                        </div>

                        <div className="flex flex-col gap-y-1.5">
                            <BetterTypography variant="xs" weight="medium">Label</BetterTypography>
                            <Controller
                                name="label"
                                control={control}
                                render={({ field }) => (
                                    <LabelInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={labels.map(l => l.name)}
                                        placeholder="Type or select a label"
                                        error={errors.label?.message as string}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-y-1.5">
                                <BetterTypography variant="xs" weight="medium">Priority</BetterTypography>
                                <Controller name="priority" control={control} render={({ field }) => (
                                    <Dropdown
                                        value={field.value}
                                        options={priorityOptions}
                                        onValueChange={field.onChange}
                                        triggerVariant="primary"
                                        triggerClassName='justify-between'
                                        labelVariant='xs'
                                    />
                                )} />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <BetterTypography variant="xs" weight="medium">Deadline (Optional)</BetterTypography>
                                <TextInput type="date" {...register("deadline")} />
                            </div>
                        </div>
                    </div>

                    {/* 🌟 Section 2: Behavior & Style */}
                    <div className="flex flex-col gap-y-4">

                        <div className="flex flex-col gap-y-1.5">
                            <BetterTypography variant="xs" weight="medium">Color</BetterTypography>
                            <Controller name="color" control={control} render={({ field }) => (
                                <ColorPicker options={colorOptions} selectedId={field.value} onSelect={field.onChange} />
                            )} />
                        </div>

                        <div className="flex flex-col gap-y-1.5">
                            <BetterTypography variant="xs" weight="medium">Interaction Mode</BetterTypography>
                            <Controller
                                name="interactionMode"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex gap-x-1 p-1 liquid-glass rounded-3xl">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={field.value === 'linear' ? 'primary-active' : 'ghost'}
                                            onClick={() => field.onChange('linear')}
                                            className="flex-1"
                                        >
                                            Linear
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={field.value === 'free' ? 'primary-active' : 'ghost'}
                                            onClick={() => field.onChange('free')}
                                            className="flex-1"
                                        >
                                            Free
                                        </Button>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* 🌟 Section 3: Steps */}
                    <div className="flex flex-col gap-y-3">
                        <div className="flex-center-between">
                            <BetterTypography variant="xs" weight="semibold" className="text-muted-foreground">Steps</BetterTypography>
                            <Button type="button" variant="ghost" size="sm" onClick={handleAddStep}>
                                <PlusIcon className="size-3.5 mr-1" /> Add Step
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="text-center py-6 flex flex-col">
                                <BetterTypography variant="sm" className="text-muted-foreground">No steps added.</BetterTypography>
                                <BetterTypography variant="xs" className="text-muted-foreground mt-1">This will act as a single task.</BetterTypography>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex-row-center gap-x-2 h-10">
                                        <input type="hidden" {...register(`steps.${index}.id` as const)} />
                                        <div className="flex-1">
                                            <TextInput
                                                id={`step-input-${index}`} // 🌟 Added ID for auto-focus targeting
                                                {...register(`steps.${index}.content` as const)}
                                                placeholder={watchInteractionMode === 'linear' ? `Step ${index + 1} description (optional)...` : "Step description (optional)..."} // 🌟 Updated placeholder
                                                className="w-full h-full"
                                                error={(errors.steps?.[index]?.content)?.message as string}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost-destructive"
                                            className="h-full flex-center"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2Icon className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-x-2 mt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">{isEditing ? "Save" : "Create"}</Button>
                    </div>
                </form>
            </div>
        </ModalWrapper>
    );
}