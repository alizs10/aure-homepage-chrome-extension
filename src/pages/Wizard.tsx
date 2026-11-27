import { useSettingsStore } from "@/stores";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import type {
  Accent,
  BlurSize,
  SearchEngineId,
  Settings,
  WallpaperBlur,
  WallpaperBrightness,
} from "@/types";
import {
  wizardSchema,
  type WizardFormValues,
} from "@/components/wizard/validation/wizard-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { WizardContent } from "@/components/wizard/WizardContent";
import { WizardNavigation } from "@/components/wizard/components/WizardNavigation";
import { WizardWelcome } from "@/components/wizard/components/WizardWelcome";
import { STEPS } from "@/components/wizard/constants/steps";
import { toast } from "@/stores/useToastStore";
import { DEFAULT_WIDGET_LAYOUT } from "@/constants/widget-weights";
import { isFirefox } from "@/lib/browser";
import { seedDefaultFolders, useFoldersStore } from "@/features/bookmarks";
import { CURRENT_SCHEMA_VERSION } from "@/lib/migrations";
import { BetterTypography } from "@/components/common/BetterTypography";

export default function Wizard() {
  const save = useSettingsStore((s) => s.save);
  const settings = useSettingsStore((s) => s.settings);
  const isImporting = useSettingsStore((s) => s.isImporting);
  const updatePreview = useSettingsStore((s) => s.updatePreview);
  const setPreview = useSettingsStore((s) => s.setPreview);

  const [viewMode, setViewMode] = useState<"welcome" | "wizard">("welcome");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const initialDefaults: WizardFormValues = {
    name: "",
    theme: "system",
    wallpaper: "default",
    wallpaper_brightness: "100",
    wallpaper_blur: isFirefox ? "xs" : "none",
    accent: "golden",
    blur: isFirefox ? "none" : "xs",
    search_engine: "google",
    enable_ip_checker: false,
  };

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
    defaultValues: initialDefaults,
  });

  const theme = watch("theme");
  const wallpaper = watch("wallpaper");
  const wallpaperBrightness = watch("wallpaper_brightness") ?? "100";
  const wallpaperBlur = watch("wallpaper_blur") ?? (isFirefox ? "xs" : "none");
  const accent = (watch("accent") as Accent) ?? "golden";
  const blur = (watch("blur") as BlurSize) ?? (isFirefox ? "none" : "xs");
  const searchEngine = (watch("search_engine") as SearchEngineId) ?? "google";
  const enableIpChecker = watch("enable_ip_checker") ?? false;

  // Reactively apply live preview on mount and whenever appearance preferences change
  useEffect(() => {
    updatePreview({
      theme,
      wallpaper,
      wallpaper_brightness: wallpaperBrightness as WallpaperBrightness,
      wallpaper_blur: wallpaperBlur as WallpaperBlur,
      accent,
      blur,
    });

    return () => {
      setPreview(null);
    };
  }, [
    theme,
    wallpaper,
    wallpaperBrightness,
    wallpaperBlur,
    accent,
    blur,
    updatePreview,
    setPreview,
  ]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setValue("theme", newTheme, { shouldDirty: true });
  };

  const handleWallpaperChange = (id: string) => {
    setValue("wallpaper", id, { shouldDirty: true });
  };

  const handleBrightnessChange = (brightness: string) => {
    setValue("wallpaper_brightness", brightness, { shouldDirty: true });
  };

  const handleWallpaperBlurChange = (blurVal: string) => {
    setValue("wallpaper_blur", blurVal, { shouldDirty: true });
  };

  const handleAccentChange = (accentVal: Accent) => {
    setValue("accent", accentVal, { shouldDirty: true });
  };

  const handleBlurChange = (blurVal: BlurSize) => {
    setValue("blur", blurVal, { shouldDirty: true });
  };

  const handleSearchEngineChange = (engineId: SearchEngineId) => {
    setValue("search_engine", engineId, { shouldDirty: true });
  };

  const handleToggleIpChecker = (enabled: boolean) => {
    setValue("enable_ip_checker", enabled, { shouldDirty: true });
  };

  async function next() {
    switch (currentStep) {
      case 1: {
        const valid = await trigger("name");
        if (!valid) return;
        break;
      }
      case 2:
      case 3:
        break;
      case 4:
        handleSubmit(onSubmit)();
        return;
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  }

  function prev() {
    if (currentStep === 1) {
      setViewMode("welcome");
      return;
    }
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  const onSubmit = async (data: WizardFormValues) => {
    const settingsToSave: Settings = {
      schema_version: CURRENT_SCHEMA_VERSION,
      name: data.name,
      theme: data.theme,
      wallpaper: data.wallpaper,
      wallpaper_blur:
        (data.wallpaper_blur as WallpaperBlur) || (isFirefox ? "xs" : "none"),
      wallpaper_brightness:
        (data.wallpaper_brightness as WallpaperBrightness) || "100",
      blur: (data.blur as BlurSize) || (isFirefox ? "none" : "xs"),
      accent: (data.accent as Accent) || "golden",
      search_engine: (data.search_engine as SearchEngineId) || "google",
      open_search_in_new_tab: false,
      open_bookmarks_in_new_tab: false,
      show_top_sites: true,
      show_favorites: true,
      show_folders: true,
      show_routines: true,
      enable_ip_checker: data.enable_ip_checker ?? false,
      widget_layout: DEFAULT_WIDGET_LAYOUT,
    };

    await seedDefaultFolders();
    await useFoldersStore.getState().initialize();
    setPreview(null);
    await save(settingsToSave);
    toast.success("Welcome to Aure Homepage! Your setup is ready.");
    navigate("/", { replace: true });
  };

  if (settings && !isImporting) {
    return <Navigate to="/" replace />;
  }

  const activeStepMeta = STEPS[currentStep - 1] ?? STEPS[0];

  return (
    <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* 🌟 Single Unified Glass Card with Locked Height */}
      <section
        className="w-full max-w-6xl h-full max-h-[88vh] rounded-3xl liquid-glass flex flex-col relative"
        aria-label="Setup Wizard"
      >
        {viewMode === "welcome" ? (
          /* Welcome / Choice View */
          <WizardWelcome onStartNew={() => setViewMode("wizard")} />
        ) : (
          /* Wizard Steps View */
          <>
            {/* 🌟 Card Header */}
            <header className="sticky top-0 flex-none flex flex-col gap-y-0.5 p-5 sm:p-7">
              <BetterTypography variant="md" weight="bold">
                {activeStepMeta.title}
              </BetterTypography>
              <BetterTypography variant="xs" className="text-muted-foreground">
                {activeStepMeta.description}
              </BetterTypography>
            </header>

            {/* 🌟 Card Body (Scrollable, full-width content area) */}
            <main className="flex-1 min-h-0 overflow-y-scroll scrollbar-none">
              <WizardContent
                currentStep={currentStep}
                register={register}
                errors={errors}
                theme={theme}
                wallpaper={wallpaper}
                wallpaperBrightness={wallpaperBrightness}
                wallpaperBlur={wallpaperBlur}
                accent={accent}
                blur={blur}
                searchEngine={searchEngine}
                enableIpChecker={enableIpChecker}
                onThemeChange={handleThemeChange}
                onWallpaperChange={handleWallpaperChange}
                onBrightnessChange={handleBrightnessChange}
                onWallpaperBlurChange={handleWallpaperBlurChange}
                onAccentChange={handleAccentChange}
                onBlurChange={handleBlurChange}
                onSearchEngineChange={handleSearchEngineChange}
                onToggleIpChecker={handleToggleIpChecker}
                onNext={next}
              />
            </main>

            {/* 🌟 Card Footer */}
            <footer className="flex-none p-5 sm:p-7">
              <WizardNavigation
                currentStep={currentStep}
                isLastStep={currentStep === STEPS.length}
                onPrev={prev}
                onNext={next}
              />
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
