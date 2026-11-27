import { BetterTypography } from "@/components/common/BetterTypography";
import { ChooseTheme } from "./ChooseTheme";
import { WallpapersSection } from "@/components/settings/components/tabs-details/preferences-tab-details/WallpapersSection";
import WallpaperBrightnessSection from "@/components/settings/components/tabs-details/preferences-tab-details/WallpaperBrightnessSection";
import WallpaperBlurSection from "@/components/settings/components/tabs-details/preferences-tab-details/WallpaperBlurSection";
import AccentSection from "@/components/settings/components/tabs-details/preferences-tab-details/AccentSection";
import BlurSection from "@/components/settings/components/tabs-details/preferences-tab-details/BlurSection";
import type { Accent, BlurSize, Theme } from "@/types";

export interface FullPreferencesStepProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  wallpaper: string;
  onWallpaperChange: (wallpaper: string) => void;
  wallpaperBrightness: string;
  onWallpaperBrightnessChange: (brightness: string) => void;
  wallpaperBlur: string;
  onWallpaperBlurChange: (blur: string) => void;
  accent: Accent;
  onAccentChange: (accent: Accent) => void;
  blur: BlurSize;
  onBlurChange: (blur: BlurSize) => void;
}

const WIZARD_PREFERENCES_GRID_COLS =
  "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 p-1";

export function FullPreferencesStep({
  theme,
  onThemeChange,
  wallpaper,
  onWallpaperChange,
  wallpaperBrightness,
  onWallpaperBrightnessChange,
  wallpaperBlur,
  onWallpaperBlurChange,
  accent,
  onAccentChange,
  blur,
  onBlurChange,
}: FullPreferencesStepProps) {
  return (
    <div className="flex flex-col gap-y-8 w-full p-5 sm:p-7">
      {/* Row 1: Theme Selection */}
      <div className="flex flex-col gap-y-2">
        <BetterTypography as="h3" variant="md" weight="medium" className="px-1">
          Choose Theme
        </BetterTypography>
        <ChooseTheme
          value={theme}
          onChange={onThemeChange}
          wallpaper={wallpaper}
          gridClassName={WIZARD_PREFERENCES_GRID_COLS}
        />
      </div>

      {/* Row 2: Wallpapers & Backgrounds */}
      <div className="flex flex-col gap-y-2">
        <WallpapersSection
          value={wallpaper}
          onSelect={onWallpaperChange}
          gridClassName={WIZARD_PREFERENCES_GRID_COLS}
        />
      </div>

      {/* Row 3: Wallpaper Brightness (Own Row) */}
      <div className="flex flex-col gap-y-2 px-1">
        <WallpaperBrightnessSection
          value={wallpaperBrightness}
          onChange={onWallpaperBrightnessChange}
        />
      </div>

      {/* Row 4: Wallpaper Blur (Own Row) */}
      <div className="flex flex-col gap-y-2 px-1">
        <WallpaperBlurSection
          value={wallpaperBlur}
          onChange={onWallpaperBlurChange}
        />
      </div>

      {/* Row 5: Accent Color (Own Row) */}
      <div className="flex flex-col gap-y-2 px-1">
        <AccentSection value={accent} onChange={onAccentChange} />
      </div>

      {/* Row 6: UI Glassmorphism Blur (Own Row) */}
      <div className="flex flex-col gap-y-2 px-1">
        <BlurSection value={blur} onChange={onBlurChange} />
      </div>
    </div>
  );
}
