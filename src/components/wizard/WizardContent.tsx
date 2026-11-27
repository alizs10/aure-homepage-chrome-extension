import type { Accent, BlurSize, SearchEngineId, Theme } from "@/types";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { WizardFormValues } from "./validation/wizard-schema";
import { EnterName } from "./components/EnterName";
import { FullPreferencesStep } from "./components/FullPreferencesStep";
import { ChooseSearchEngine } from "./components/ChooseSearchEngine";
import { PrivacyAndPermissions } from "./components/PrivacyAndPermissions";

export interface WizardContentProps {
    currentStep: number;
    register: UseFormRegister<WizardFormValues>;
    errors: FieldErrors<WizardFormValues>;
    theme: Theme;
    wallpaper: string;
    wallpaperBrightness: string;
    wallpaperBlur: string;
    accent: Accent;
    blur: BlurSize;
    searchEngine: SearchEngineId | string;
    enableIpChecker: boolean;
    onThemeChange: (theme: Theme) => void;
    onWallpaperChange: (id: string) => void;
    onBrightnessChange: (brightness: string) => void;
    onWallpaperBlurChange: (blur: string) => void;
    onAccentChange: (accent: Accent) => void;
    onBlurChange: (blur: BlurSize) => void;
    onSearchEngineChange: (engineId: SearchEngineId) => void;
    onToggleIpChecker: (enabled: boolean) => void;
    onNext: () => void;
}

export function WizardContent({
    currentStep,
    register,
    errors,
    theme,
    wallpaper,
    wallpaperBrightness,
    wallpaperBlur,
    accent,
    blur,
    searchEngine,
    enableIpChecker,
    onThemeChange,
    onWallpaperChange,
    onBrightnessChange,
    onWallpaperBlurChange,
    onAccentChange,
    onBlurChange,
    onSearchEngineChange,
    onToggleIpChecker,
    onNext,
}: WizardContentProps) {
    switch (currentStep) {
        case 1:
            return (
                <EnterName
                    register={register}
                    errors={errors}
                    onNext={onNext}
                />
            );
        case 2:
            return (
                <FullPreferencesStep
                    theme={theme}
                    onThemeChange={onThemeChange}
                    wallpaper={wallpaper}
                    onWallpaperChange={onWallpaperChange}
                    wallpaperBrightness={wallpaperBrightness}
                    onWallpaperBrightnessChange={onBrightnessChange}
                    wallpaperBlur={wallpaperBlur}
                    onWallpaperBlurChange={onWallpaperBlurChange}
                    accent={accent}
                    onAccentChange={onAccentChange}
                    blur={blur}
                    onBlurChange={onBlurChange}
                />
            );
        case 3:
            return (
                <ChooseSearchEngine
                    value={searchEngine}
                    onChange={onSearchEngineChange}
                />
            );
        case 4:
            return (
                <PrivacyAndPermissions
                    enableIpChecker={enableIpChecker}
                    onToggleIpChecker={onToggleIpChecker}
                />
            );
        default:
            return null;
    }
}
