import { BetterTypography } from "@/components/common/BetterTypography";
import { WizardStepper } from "./WizardStepper";

export function WizardIntro({ currentStep }: { currentStep: number }) {
    return (
        <div className="col-span-1 lg:col-span-2 flex-1 app_container app_gradient app-blur p-5 flex flex-col gap-y-4 lg:gap-y-6 min-h-60 lg:min-h-100">
            <BetterTypography variant="xl">
                Setup Wizard
            </BetterTypography>
            <BetterTypography variant="md">
                Lets quickly set you up!
            </BetterTypography>

            <div className="mt-auto">
                <WizardStepper currentStep={currentStep} />
            </div>
        </div>
    );
}