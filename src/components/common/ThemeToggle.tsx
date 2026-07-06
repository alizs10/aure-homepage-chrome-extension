import { Monitor, Moon, Sun } from "lucide-react";
import Button from "./Button";
import { useSettingsStore } from "@/stores";

export default function ThemeToggle() {
    const theme = useSettingsStore((s) => s.settings?.theme);
    const update = useSettingsStore((s) => s.update);
    const loading = useSettingsStore((s) => s.loading);

    if (loading || !theme) {
        return (
            <div className="flex items-center gap-1 p-1 app_container app_gradient app-blur h-16">
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
                <div className="h-full aspect-square rounded-full bg-muted animate-pulse" />
            </div>
        );
    }

    return (
        <div className="p-1 h-16 app_container app_gradient app-blur flex-row-center gap-x-1">
            <Button
                onClick={() => update({ theme: "light" })}
                size="icon-sm"
                variant={theme === "light" ? "primary" : "ghost"}
                className={`h-full ${theme === "light" ? "to-primary/20 dark:to-primary/50" : ""
                    }`}
            >
                <Sun className="size-6" />
            </Button>

            <Button
                onClick={() => update({ theme: "dark" })}
                size="icon-sm"
                variant={theme === "dark" ? "primary" : "ghost"}
                className={`h-full ${theme === "dark" ? "to-primary/20 dark:to-primary/50" : ""
                    }`}
            >
                <Moon className="size-6" />
            </Button>

            <Button
                onClick={() => update({ theme: "system" })}
                size="icon-sm"
                variant={theme === "system" ? "primary" : "ghost"}
                className={`h-full ${theme === "system" ? "to-primary/20 dark:to-primary/50" : ""
                    }`}
            >
                <Monitor className="size-6" />
            </Button>
        </div>
    );
}