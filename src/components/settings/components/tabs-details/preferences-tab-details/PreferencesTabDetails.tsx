import { BetterTypography } from "@/components/common/BetterTypography"
import { ChooseTheme } from "@/components/wizard/components/ChooseTheme"
import { useTheme } from "@/hooks/useTheme"
import { useSettingsStore } from "@/stores"
import AccentSection from "./AccentSection"
import BlurSection from "./BlurSection"
import { WallpapersSection } from "./WallpapersSection";
import WallpaperBrightnessSection from "./WallpaperBrightnessSection"
import WallpaperBlurSection from "./WallpaperBlurSection"

export default function PreferencesTabDetails() {
    const { update } = useSettingsStore()
    const { resolvedTheme } = useTheme()

    return (
        <div className="h-fit flex-1 flex flex-col gap-10">

            {/* --- Theme Section --- */}
            <div className="flex flex-col gap-y-2">
                <label htmlFor="theme">
                    <BetterTypography as="h3" variant="md" weight="medium">
                        Choose Theme
                    </BetterTypography>
                </label>


                <ChooseTheme
                    value={resolvedTheme}
                    onChange={t => update({ theme: t })}
                />
            </div>

            {/* --- Wallpapers Section --- */}
            <div className="flex flex-col gap-y-6">
                <WallpapersSection />
                <WallpaperBrightnessSection />
                <WallpaperBlurSection />
            </div>

            {/* --- Accent Section --- */}
            <AccentSection />

            {/* --- UI Blur Section --- */}
            <BlurSection />
        </div>
    )
}