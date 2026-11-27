import type { Theme } from "@/types";
import { Moon, Sun, Monitor } from "lucide-react";
import Badge from "@/components/ui/Badge";
import {
    BUILTIN_WALLPAPERS,
    DEFAULT_WALLPAPERS,
    isColor,
    useWallpaperStore,
} from "@/features/wallpapers";
import { useSettingsStore } from "@/stores";
import { cn } from "@/lib/util";

export const SETTINGS_THEME_GRID_COLS =
    "grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 p-1";

export interface ChooseThemeProps {
    value: Theme;
    onChange: (theme: Theme) => void;
    wallpaper?: string;
    gridClassName?: string;
}

interface ThemeOption {
    id: Theme;
    label: string;
    icon: typeof Sun;
}

const THEME_OPTIONS: ThemeOption[] = [
    {
        id: "light",
        label: "Light",
        icon: Sun,
    },
    {
        id: "dark",
        label: "Dark",
        icon: Moon,
    },
    {
        id: "system",
        label: "System",
        icon: Monitor,
    },
];

export function ChooseTheme({
    value,
    onChange,
    wallpaper,
    gridClassName,
}: ChooseThemeProps) {
    const storeWallpaper = useSettingsStore(
        (s) => s.preview?.wallpaper ?? s.settings?.wallpaper
    );
    const customWallpapers = useWallpaperStore((s) => s.customWallpapers);

    const activeWallpaperId = wallpaper ?? storeWallpaper ?? "default";
    const activeWallpaper =
        !activeWallpaperId || activeWallpaperId === "default"
            ? DEFAULT_WALLPAPERS[0]
            : BUILTIN_WALLPAPERS.find((w) => w.id === activeWallpaperId) ??
              customWallpapers.find((w) => w.id === activeWallpaperId) ??
              DEFAULT_WALLPAPERS[0];

    const lightVariant =
        activeWallpaper?.variants.light ||
        activeWallpaper?.variants.dark ||
        DEFAULT_WALLPAPERS[0].variants.light;
    const darkVariant =
        activeWallpaper?.variants.dark ||
        activeWallpaper?.variants.light ||
        DEFAULT_WALLPAPERS[0].variants.dark;

    const isLightColor = isColor(lightVariant);
    const isDarkColor = isColor(darkVariant);

    return (
        <div
            className={cn(
                "grid w-full",
                gridClassName || SETTINGS_THEME_GRID_COLS
            )}
        >
            {THEME_OPTIONS.map((theme) => {
                const isSelected = value === theme.id;
                const Icon = theme.icon;

                return (
                    <div
                        key={theme.id}
                        onClick={() => onChange(theme.id)}
                        className={`${
                            isSelected
                                ? "outline-primary"
                                : "outline-transparent hover:outline-primary"
                        } outline-2 p-1 rounded-[28px] cursor-pointer transition-all`}
                    >
                        <div className="relative group aspect-video rounded-3xl overflow-hidden cursor-pointer border border-border/40 flex items-center justify-center bg-secondary/50">
                            {/* Theme Background Variants */}
                            {theme.id === "light" && (
                                isLightColor ? (
                                    <div
                                        style={{ backgroundColor: lightVariant }}
                                        className="absolute inset-0"
                                    />
                                ) : (
                                    <img
                                        src={lightVariant}
                                        alt="Light theme preview"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )
                            )}

                            {theme.id === "dark" && (
                                isDarkColor ? (
                                    <div
                                        style={{ backgroundColor: darkVariant }}
                                        className="absolute inset-0"
                                    />
                                ) : (
                                    <img
                                        src={darkVariant}
                                        alt="Dark theme preview"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )
                            )}

                            {theme.id === "system" && (
                                <>
                                    {isDarkColor ? (
                                        <div
                                            style={{ backgroundColor: darkVariant }}
                                            className="absolute inset-0"
                                        />
                                    ) : (
                                        <img
                                            src={darkVariant}
                                            alt="System dark preview"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}

                                    {isLightColor ? (
                                        <div
                                            style={{
                                                backgroundColor: lightVariant,
                                                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                                            }}
                                            className="absolute inset-0"
                                        />
                                    ) : (
                                        <img
                                            src={lightVariant}
                                            alt="System light preview"
                                            style={{
                                                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                                            }}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                </>
                            )}

                            {/* Theme Label Badge with Icon */}
                            <div className="absolute bottom-2 left-2 pointer-events-none">
                                <Badge
                                    size="sm"
                                    variant="secondary"
                                    className="text-foreground"
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Icon className="size-3.5 shrink-0" />
                                        <span>{theme.label}</span>
                                    </span>
                                </Badge>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
