import { ChevronDownIcon, ChevronUpIcon, Monitor, Moon, Sun } from "lucide-react";
import Button from "../ui/Button";
import { useSettingsStore } from "@/stores";
import { useState } from "react";
import useClickOutside from "@/hooks/useOutsideClick";
import { triggerThemeTransition } from "@/lib/theme-transition"; // <-- Import the helper

export default function ThemeToggle() {
    const theme = useSettingsStore((s) => s.settings?.theme);
    const update = useSettingsStore((s) => s.update);
    const loading = useSettingsStore((s) => s.loading);

    const [open, setOpen] = useState(false);
    const containerRef = useClickOutside(() => setOpen(false));

    if (loading || !theme) {
        return (
            <div className="flex items-center gap-1 p-1 app_container app_shadow app_gradient app-blur h-full">
                <div className="hidden lg:block h-full aspect-square rounded-full bg-muted animate-pulse" />
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="p-1 h-full app_container app_shadow app_gradient app-blur flex-row-center gap-x-1 relative z-50">
            <Button
                onClick={(e) => triggerThemeTransition("light", e, update)}
                size="icon-sm"
                variant={theme === "light" ? "primary-active" : "ghost"}
                className={`h-full ${theme === "light" ? "" : "hidden lg:inline-flex"}`}
            >
                <Sun className="size-4 md:size-5 lg:size-6" />
            </Button>

            <Button
                onClick={(e) => triggerThemeTransition("dark", e, update)}
                size="icon-sm"
                variant={theme === "dark" ? "primary-active" : "ghost"}
                className={`h-full ${theme === "dark" ? "" : "hidden lg:inline-flex"}`}
            >
                <Moon className="size-4 md:size-5 lg:size-6" />
            </Button>

            <Button
                onClick={(e) => triggerThemeTransition("system", e, update)}
                size="icon-sm"
                variant={theme === "system" ? "primary-active" : "ghost"}
                className={`h-full ${theme === "system" ? "" : "hidden lg:inline-flex"}`}
            >
                <Monitor className="size-4 md:size-5 lg:size-6" />
            </Button>

            <Button
                onClick={() => setOpen(prev => !prev)}
                size="icon-sm"
                variant="ghost"
                className="h-full lg:hidden"
            >
                {open ? <ChevronUpIcon className="size-4 md:size-5 lg:size-6" /> : <ChevronDownIcon className="size-4 md:size-5 lg:size-6" />}
            </Button>

            {open && (
                <ul className="lg:hidden flex flex-col gap-y-0.5 p-1 md:p-2 absolute z-9999 top-full right-0 w-fit app_container app_shadow bg-background mt-1">
                    <Button
                        onClick={(e) => {
                            triggerThemeTransition("light", e, update);
                            setOpen(false);
                        }}
                        size="icon"
                        variant={theme === "light" ? "primary-active" : "ghost"}
                        className={theme === "light" ? "" : ""}
                    >
                        <Sun className="size-4 md:size-5 lg:size-6" />
                    </Button>

                    <Button
                        onClick={(e) => {
                            triggerThemeTransition("dark", e, update);
                            setOpen(false);
                        }}
                        size="icon"
                        variant={theme === "dark" ? "primary-active" : "ghost"}
                        className={theme === "dark" ? "" : ""}
                    >
                        <Moon className="size-4 md:size-5 lg:size-6" />
                    </Button>

                    <Button
                        onClick={(e) => {
                            triggerThemeTransition("system", e, update);
                            setOpen(false);
                        }}
                        size="icon"
                        variant={theme === "system" ? "primary-active" : "ghost"}
                        className={theme === "system" ? "" : ""}
                    >
                        <Monitor className="size-4 md:size-5 lg:size-6" />
                    </Button>
                </ul>
            )}
        </div>
    );
}