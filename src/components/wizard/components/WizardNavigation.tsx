import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import { WizardStepper } from "./WizardStepper";

export function WizardNavigation({
  currentStep,
  isLastStep,
  onPrev,
  onNext,
}: {
  currentStep: number;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <Button
        onClick={onPrev}
        variant="ghost"
        size="md"
        leftIcon={<ArrowLeftIcon className="size-4" />}
      >
        <BetterTypography variant="sm" weight="medium">
          Back
        </BetterTypography>
      </Button>

      <WizardStepper currentStep={currentStep} />

      <Button
        onClick={onNext}
        variant="primary-active"
        size="md"
        rightIcon={
          isLastStep ? (
            <CheckIcon className="size-4" />
          ) : (
            <ArrowRightIcon className="size-4" />
          )
        }
      >
        <BetterTypography variant="sm" weight="medium">
          {isLastStep ? "Finish & Launch" : "Continue"}
        </BetterTypography>
      </Button>
    </div>
  );
}
