import { Typography } from "@/components/common/Typography"
import { ChooseTheme } from "@/components/wizard/components/ChooseTheme"
import { useTheme } from "@/hooks/useTheme"
import { useSettingsStore } from "@/stores"
import BlurSection from "./BlurSection"
import { WallpapersSection } from "./WallpapersSection"; // Adjust path if needed









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

                {/* <div className="flex flex-wrap gap-x-2">
                    <button
                        onClick={() => update({ theme: 'light' })}
                        className="h-30 aspect-video rounded-3xl bg-white outline-2 outline-primary relative">
                        {settings?.theme === 'light' && (
                            <div className="absolute right-6 bottom-4">
                                <CheckCircleIcon className="size-6 text-primary" />
                            </div>
                        )}
                    </button>
                    <button
                        onClick={() => update({ theme: 'dark' })}
                        className="h-30 aspect-video rounded-3xl bg-black relative">
                        {settings?.theme === 'dark' && (
                            <div className="absolute right-6 bottom-4">
                                <CheckCircleIcon className="size-6 text-primary" />
                            </div>
                        )}
                    </button>
                </div> */}
                <ChooseTheme
                    value={resolvedTheme}
                    onChange={t => update({ theme: t })}
                />
            </div>

            {/* --- Wallpapers Section --- */}
            <WallpapersSection />

            {/* --- Blur Section --- */}
            <BlurSection />


        </div>
    )
}