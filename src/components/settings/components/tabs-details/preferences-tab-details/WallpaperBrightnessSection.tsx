import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useSettingsStore } from "@/stores";
import { wallpaperBrightnessOptions } from "@/types";

export default function WallpaperBrightnessSection() {
    const { settings, update } = useSettingsStore();
    const selectedBrightness = settings?.wallpaper_brightness ?? "100";

    return (
        <div className="flex flex-col gap-y-2">
            <BetterTypography as="h3" variant="md" weight="medium">
                Wallpaper Brightness
            </BetterTypography>

            <div className="flex flex-wrap gap-1 md:gap-2">
                {wallpaperBrightnessOptions.map(({ key, label }) => (
                    <Button
                        key={key}
                        size="sm"
                        variant={selectedBrightness === key ? "primary-active" : "primary"}
                        onClick={() => {
                            update({ wallpaper_brightness: key });
                        }}
                    >
                        <BetterTypography variant="xs" weight="medium">
                            {label}
                        </BetterTypography>
                    </Button>
                ))}
            </div>
        </div>
    );
}
