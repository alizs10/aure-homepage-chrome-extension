import { BetterTypography } from "@/components/common/BetterTypography";
import { STEPS } from "../constants/steps";

export function WizardStepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass border border-border/40 select-none">
            <BetterTypography variant="xs" className="text-muted-foreground font-medium whitespace-nowrap">
                Step <span className="text-foreground font-semibold">{currentStep}</span> of {STEPS.length}
            </BetterTypography>

            <div className="flex items-center gap-1" aria-hidden="true">
                {STEPS.map((step) => {
                    const active = step.id === currentStep;
                    const completed = step.id < currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                active
                                    ? "w-3.5 bg-primary"
                                    : completed
                                    ? "w-1.5 bg-primary/60"
                                    : "w-1.5 bg-muted-foreground/30"
                            }`}
                        />
                    );
                })}
            </div>
        </div>
    );
}

