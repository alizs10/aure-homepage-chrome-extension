import { ChevronDownIcon, ChevronUpIcon, Monitor, Moon, Sun } from "lucide-react";
import Button from "../ui/Button";
import { useSettingsStore } from "@/stores";
import { useState } from "react";
import useClickOutside from "@/hooks/useOutsideClick";

export default function ThemeToggle() {
    const theme = useSettingsStore((s) => s.settings?.theme);
    const update = useSettingsStore((s) => s.update);
    const loading = useSettingsStore((s) => s.loading);

    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    const containerRef = useClickOutside(() => setOpen(false))

    if (loading || !theme) {
        return (
            <div className="flex items-center gap-1 p-1 app_container app_gradient app-blur h-full">
                <div className="hidden lg:block h-full aspect-square rounded-full bg-muted animate-pulse" />
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="p-1 h-full app_container app_gradient app-blur flex-row-center gap-x-1 relative z-40">
            <Button
                onClick={() => update({ theme: "light" })}
                size="icon-sm"
                variant={theme === "light" ? "primary" : "ghost"}
                className={`h-full ${theme === "light" ? "bg-none lg:to-primary/20 lg:dark:to-primary/50" : "hidden lg:inline-flex"
                    }`}
            >
                <Sun className="size-4 md:size-5 lg:size-6" />
            </Button>

            <Button
                onClick={() => update({ theme: "dark" })}
                size="icon-sm"
                variant={theme === "dark" ? "primary" : "ghost"}
                className={`h-full ${theme === "dark" ? "bg-none lg:to-primary/20 lg:dark:to-primary/50" : "hidden lg:inline-flex"
                    }`}
            >
                <Moon className="size-4 md:size-5 lg:size-6" />
            </Button>

            <Button
                onClick={() => update({ theme: "system" })}
                size="icon-sm"
                variant={theme === "system" ? "primary" : "ghost"}
                className={`h-full ${theme === "system" ? "bg-none lg:to-primary/20 lg:dark:to-primary/50" : "hidden lg:inline-flex"
                    }`}
            >
                <Monitor className="size-4 md:size-5 lg:size-6" />
            </Button>

            <Button
                onClick={toggle}
                size="icon-sm"
                variant={"ghost"}
                className={`h-full lg:hidden`}
            >
                {open ? (<ChevronUpIcon className="size-4 md:size-5 lg:size-6" />) : (<ChevronDownIcon className="size-4 md:size-5 lg:size-6" />)}
            </Button>

            {open && (
                <ul className="lg:hidden flex flex-col gap-y-0.5 p-1 md:p-2 absolute z-40 top-full right-0 w-fit app_container bg-background mt-1">
                    <Button
                        onClick={() => update({ theme: "light" })}
                        size="icon"
                        variant={theme === "light" ? "primary" : "ghost"}
                        className={`${theme === "light" ? "to-primary/20 dark:to-primary/50" : ""
                            }`}
                    >
                        <Sun className="size-4 md:size-5 lg:size-6" />
                    </Button>

                    <Button
                        onClick={() => update({ theme: "dark" })}
                        size="icon"
                        variant={theme === "dark" ? "primary" : "ghost"}
                        className={`${theme === "dark" ? "to-primary/20 dark:to-primary/50" : ""
                            }`}
                    >
                        <Moon className="size-4 md:size-5 lg:size-6" />
                    </Button>

                    <Button
                        onClick={() => update({ theme: "system" })}
                        size="icon"
                        variant={theme === "system" ? "primary" : "ghost"}
                        className={`${theme === "system" ? "to-primary/20 dark:to-primary/50" : ""
                            }`}
                    >
                        <Monitor className="size-4 md:size-5 lg:size-6" />
                    </Button>
                </ul>
            )}

        </div>
    );
}