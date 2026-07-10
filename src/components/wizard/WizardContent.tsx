import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { WizardFormValues } from "./validation/wizard-schema";
import type { Theme } from "@/types";
import { useMemo } from "react";
import { STEPS } from "./constants/steps";
import { Typography } from "../common/Typography";
import { EnterName } from "./components/EnterName";
import { ChooseTheme } from "./components/ChooseTheme";
import { WizardNavigation } from "./components/WizardNavigation";
import { ChooseWallpaper } from "./components/ChooseWallpaper";


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
        <div className="flex flex-col gap-y-4 col-span-1 lg:col-span-3 flex-1 lg:min-h-0 app_container app_gradient app-blur p-5 min-h-80">
            {step && (
                <Typography className="capitalize" variant="h2">
                    {`${step.id}. ${step.label}`}
                </Typography>
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