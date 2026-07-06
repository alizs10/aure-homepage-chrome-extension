import Button from "@/components/common/Button";
import { Typography } from "@/components/common/Typography";
import { useSettingsStore } from "@/stores";
import { blurOptions } from "@/types";
import { useEffect } from "react";

export default function BlurSection() {

    const { settings, update } = useSettingsStore();

    const selectedBlur = settings?.blur ?? 'md';

    useEffect(() => {
        const blur = blurOptions.find(
            option => option.key === settings?.blur
        );

        if (blur) {
            document.documentElement.style.setProperty(
                "--app-blur",
                blur.value
            );
        }
    }, [settings?.blur]);

    return (
        <div className="flex flex-col gap-y-2">
            <Typography variant="h3">Blur</Typography>

            <div className="flex flex-wrap gap-2">
                {blurOptions.map(({ key, label }) => (
                    <Button
                        key={key}
                        size="sm"
                        variant={selectedBlur === key ? "primary-active" : "primary"}
                        onClick={() => {
                            update({ blur: key });
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}