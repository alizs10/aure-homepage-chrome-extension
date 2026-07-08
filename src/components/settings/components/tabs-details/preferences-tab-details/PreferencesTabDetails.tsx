import { Typography } from "@/components/common/Typography"
import { ChooseTheme } from "@/components/wizard/components/ChooseTheme"
import { useTheme } from "@/hooks/useTheme"
import { useSettingsStore } from "@/stores"
import BlurSection from "./BlurSection"
import { WallpapersSection } from "./WallpapersSection"; // Adjust path if needed
import AccentSection from "./AccentSection"









export default function PreferencesTabDetails() {
    const { update } = useSettingsStore()
    const { resolvedTheme } = useTheme()

    return (
        <div className="lex-1 min-h-0 flex flex-col gap-10 h-full">

            {/* --- Theme Section --- */}
            <div className="flex flex-col gap-y-2">
                <label htmlFor="theme">
                    <Typography variant="h3">
                        Choose Theme
                    </Typography>
                </label>


                <ChooseTheme
                    value={resolvedTheme}
                    onChange={t => update({ theme: t })}
                />
            </div>

            {/* --- Wallpapers Section --- */}
            <WallpapersSection />

            {/* --- Accent Section --- */}
            <AccentSection />


            {/* --- Blur Section --- */}
            <BlurSection />


        </div>
    )
}