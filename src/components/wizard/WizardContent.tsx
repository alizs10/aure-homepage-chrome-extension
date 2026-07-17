import type { Theme } from "@/types";
import { useMemo } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { BetterTypography } from "../common/BetterTypography";
import { ChooseTheme } from "./components/ChooseTheme";
import { ChooseWallpaper } from "./components/ChooseWallpaper";
import { EnterName } from "./components/EnterName";
import { WizardNavigation } from "./components/WizardNavigation";
import { STEPS } from "./constants/steps";
import type { WizardFormValues } from "./validation/wizard-schema";


export function WizardContent({
    currentStep,
    register,
    errors,
    theme,
    wallpaper,
    onThemeChange,
    onWallpaperChange,
    onNext,
    onPrev,
}: {
    currentStep: number;
    register: UseFormRegister<WizardFormValues>;
    errors: FieldErrors<WizardFormValues>;
    theme: Theme;
    wallpaper: string;
    onThemeChange: (theme: Theme) => void;
    onWallpaperChange: (id: string) => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    const step = useMemo(() => {
        return STEPS.find(s => s.id === currentStep);
    }, [currentStep]);

    return (
        <div className="flex flex-col gap-y-4 col-span-1 lg:col-span-3 flex-1 app_container app_gradient app-blur p-5 min-h-80 lg:min-h-100">
            {step && (
                <BetterTypography className="capitalize" variant="lg" weight="semibold">
                    {`${step.id}. ${step.label}`}
                </BetterTypography>
            )}

            {currentStep === 1 && (
                <EnterName register={register} errors={errors} onNext={onNext} />
            )}
            {currentStep === 2 && (
                <ChooseTheme
                    value={theme}
                    onChange={onThemeChange}
                />
            )}
            {currentStep === 3 && (
                <ChooseWallpaper
                    value={wallpaper}
                    onChange={onWallpaperChange}
                />
            )}

            <WizardNavigation
                currentStep={currentStep}
                onPrev={onPrev}
                onNext={onNext}
            />
        </div>
    );
}