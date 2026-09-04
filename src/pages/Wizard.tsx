import { useSettingsStore } from "@/stores";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Settings } from "../types/settings";
import { wizardSchema, type WizardFormValues } from "@/components/wizard/validation/wizard-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { WizardIntro } from "@/components/wizard/components/WizardIntro";
import { WizardContent } from "@/components/wizard/WizardContent";
import { toast } from "sonner";

export default function Wizard() {
    const save = useSettingsStore((s) => s.save);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<WizardFormValues>({
        resolver: zodResolver(wizardSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            theme: "light",
            wallpaper: "default",
        },
    });

    const theme = watch("theme");
    const wallpaper = watch("wallpaper");
    const [currentStep, setCurrentStep] = useState(1);

    async function next() {
        switch (currentStep) {
            case 1: {
                const valid = await trigger("name");
                if (!valid) return;
                break;
            }
            case 2: {
                const valid = await trigger("theme");
                if (!valid) return;
                break;
            }
            case 3:
                handleSubmit(onSubmit)();
                return;
        }
        setCurrentStep((s) => s + 1);
    }

    function prev() {
        if (currentStep === 1) return;
        setCurrentStep(prev => prev <= 1 ? prev : prev - 1);
    }

    const navigate = useNavigate();

    const onSubmit = async (data: WizardFormValues) => {
        // 🌟 Save settings with schema_version: 0
        // AppLoader will run migrations after navigation
        const settingsToSave: Settings = {
            schema_version: 0,
            ...data,
            blur: 'xs',
            widgets: {
                "mood-tracker": true,
                "calendar": true,
                "notes-and-checklists": true,
                "pet-house": true,
                "pomodoro": true,
            },
            accent: "default",
            show_top_sites: true,
            show_favorites: true,
            show_folders: true,
        };

        await save(settingsToSave);
        toast.success("All set, enjoy!")
        navigate("/", { replace: true });
    };

    return (
        <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col gap-y-4 overflow-y-auto scrollbar-none px-4 md:px-8 lg:px-10 py-10">
            <section className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto my-auto min-h-fit max-h-100">
                <WizardIntro currentStep={currentStep} />
                <WizardContent
                    currentStep={currentStep}
                    register={register}
                    errors={errors}
                    theme={theme}
                    wallpaper={wallpaper}
                    onThemeChange={(theme) =>
                        setValue("theme", theme, { shouldDirty: true })
                    }
                    onWallpaperChange={(id) =>
                        setValue("wallpaper", id, { shouldDirty: true })
                    }
                    onNext={next}
                    onPrev={prev}
                />
            </section>
        </div>
    );
}