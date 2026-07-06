
import Button from "@/components/common/Button";
import { Typography } from "@/components/common/Typography";
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
                    <Typography variant="h3">
                        Prev
                    </Typography>
                </Button>
            )}
            <Button
                onClick={onNext}
                variant="primary"
                size="lg"
            >
                <Typography variant="h3">
                    {currentStep === STEPS.length ? "Finish" : "Next"}
                </Typography>
            </Button>
        </div>
    );
}