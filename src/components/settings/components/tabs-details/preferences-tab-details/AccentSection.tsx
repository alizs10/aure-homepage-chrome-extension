import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/stores";
import { accentOptions } from "@/types";
import { useEffect } from "react";

export default function AccentSection() {

    const { settings, update } = useSettingsStore();

    const selectedAccent = settings?.accent ?? 'default';

    const { resolvedTheme: theme } = useTheme()

    useEffect(() => {
        const accent = accentOptions.find(
            option => option.id === settings?.accent
        );

        if (accent) {


            document.documentElement.style.setProperty(
                "--app-primary",
                accent.light
            );

            document.documentElement.style.setProperty(
                "--app-primary-dark",
                accent.dark
            );
        }
    }, [settings?.accent]);

    return (
        <div className="flex flex-col gap-y-2">
            <BetterTypography as="h3" variant="md" weight="medium">
                Accent
            </BetterTypography>

            <div className="flex flex-wrap gap-2">
                {accentOptions.map(({ id, label, light, dark }) => (
                    <Button
                        key={id}
                        size="sm"
                        variant={selectedAccent === id ? "primary-active" : "primary"}
                        onClick={() => {
                            update({ accent: id });
                        }}
                        leftIcon={<div
                            style={{
                                background: theme === 'light' ? light : dark
                            }}
                            className="size-4 rounded-full" />}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}