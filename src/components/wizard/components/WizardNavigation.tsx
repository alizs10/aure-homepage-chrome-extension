
import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { STEPS } from "../constants/steps";

export function WizardNavigation({
    currentStep,
    onPrev,
    onNext,
}: {
    currentStep: number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex justify-end mt-auto gap-x-1 items-end h-fit">
            {currentStep !== 1 && (
                <Button
                    onClick={onPrev}
                    variant="ghost"
                    size="lg"
                >
                    <BetterTypography variant="sm" weight="medium">
                        Prev
                    </BetterTypography>
                </Button>
            )}
            <Button
                onClick={onNext}
                variant="primary"
                size="lg"
            >
                <BetterTypography variant="sm" weight="medium">
                    {currentStep === STEPS.length ? "Finish" : "Next"}
                </BetterTypography>
            </Button>
        </div>
    );
}