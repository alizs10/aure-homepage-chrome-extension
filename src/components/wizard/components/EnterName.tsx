import { BetterTypography } from "@/components/common/BetterTypography";
import TextInput from "@/components/ui/TextInput";
import type { WizardFormValues } from "@/components/wizard/validation/wizard-schema";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

export function EnterName({
  register,
  errors,
  onNext,
}: {
  register: UseFormRegister<WizardFormValues>;
  errors: FieldErrors<WizardFormValues>;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 max-w-md mx-auto w-full h-full my-auto p-5 sm:p-7">
      <div className="text-center flex flex-col gap-y-2">
        <BetterTypography variant="lg" weight="semibold">
          What should we call you?
        </BetterTypography>
        <BetterTypography variant="sm" className="text-muted-foreground">
          This name will appear in your personalized greeting on the homepage.
        </BetterTypography>
      </div>

      <div className="w-full flex flex-col gap-y-2">
        <TextInput
          {...register("name")}
          placeholder="Enter your name or nickname..."
          className="text-base py-3 px-4 text-center"
          error={errors.name?.message}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();
              onNext();
            }
          }}
          autoFocus
        />
      </div>
    </div>
  );
}
