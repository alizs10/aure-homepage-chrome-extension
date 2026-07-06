import TextInput from "@/components/Form/TextInput";
import type { WizardFormValues } from "@/components/wizard/validation/wizard-schema";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

export function EnterName({
    register,
    errors,
    onNext
}: {
    register: UseFormRegister<WizardFormValues>;
    errors: FieldErrors<WizardFormValues>;
    onNext: () => void;
}) {
    return (
        <TextInput
            {...register("name")}
            placeholder="Your name..."
            error={errors.name?.message}
            onKeyDown={e => e.code === 'Enter' ? onNext() : undefined}
        />
    );
}