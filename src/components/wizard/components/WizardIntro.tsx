import { Typography } from "@/components/common/Typography";
import { WizardStepper } from "./WizardStepper";

export function WizardIntro({ currentStep }: { currentStep: number }) {
    return (
        <div className="col-span-1 lg:col-span-2 flex-1 lg:min-h-0 app_container app_gradient app-blur p-5 flex flex-col gap-y-4 lg:gap-y-6 min-h-60">
            <Typography variant="display">
                Setup Wizard
            </Typography>
            <Typography variant="h1">
                Lets quickly set you up!
            </Typography>

            <div className="mt-auto">
                <WizardStepper currentStep={currentStep} />
            </div>
        </div>
    );
}