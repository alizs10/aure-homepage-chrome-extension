import { useSettingsStore } from "@/stores";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Settings } from "../types/settings";
import { wizardSchema, type WizardFormValues } from "@/components/wizard/validation/wizard-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { WizardIntro } from "@/components/wizard/components/WizardIntro";
import { WizardContent } from "@/components/wizard/WizardContent";

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
            blur: 'md',
            widgets: {
                "mood-tracker": true,
                "calendar": true,
                "notes-and-checklists": true,
                "pet-house": true,
            },
            accent: "default"
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

                console.log("tada", errors)

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

    const onSubmit = async (data: Settings) => {

        await save({
            ...data, blur: 'md', widgets: {
                "mood-tracker": true,
                "calendar": true,
                "notes-and-checklists": true,
                "pet-house": true,
            },
            accent: "default"
        });
        navigate("/", { replace: true });
    };

    return (
        <div className="flex flex-col w-full h-screen max-h-screen overflow-y-scroll p-10 gap-y-8">

            <section className="flex-1 w-full grid grid-cols-5 gap-6 max-w-6xl mx-auto max-h-2/3 my-auto">
                <WizardIntro currentStep={currentStep} />
                <WizardContent
                    currentStep={currentStep}
                    register={register}
                    errors={errors}
                    theme={theme}
                    wallpaper={wallpaper}
                    onThemeChange={(theme) =>
                        setValue("theme", theme, {
                            shouldDirty: true,
                        })
                    }
                    onWallpaperChange={(id) =>
                        setValue("wallpaper", id, {
                            shouldDirty: true,
                        })
                    }
                    onNext={next}
                    onPrev={prev}
                />
            </section>
        </div>
    );
}