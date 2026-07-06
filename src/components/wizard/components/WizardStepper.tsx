import { Typography } from "@/components/common/Typography";
import { CheckIcon } from "lucide-react";
import { STEPS } from "../constants/steps";



export function WizardStepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="bg-secondary p-1 rounded-full overflow-clip flex flex-nowrap gap-x-1 mt-4 h-12">
            {STEPS.map((step, i) => {
                const completed = step.id < currentStep;
                const active = step.id === currentStep;

                return (
                    <div
                        key={step.id}
                        className={`${active ? "flex-1 text-primary" : "text-muted-foreground"}
                        ${completed ? "bg-primary text-primary-foreground" : ""} px-4 py-2 bg-background rounded-full text-center transition-all duration-200 flex-center`}
                    >
                        {completed ? (
                            <CheckIcon className="size-5" />
                        ) : (
                            <Typography className="text-nowrap capitalize" variant="body" weight="medium">
                                {active ? `${step.id}. ${step.label}` : `${i + 1}`}
                            </Typography>
                        )}
                    </div>
                );
            })}
        </div>
    );
}