import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useSettingsStore } from "@/stores";
import { blurOptions } from "@/types";

export default function BlurSection() {
    const { settings, update } = useSettingsStore();
    const selectedBlur = settings?.blur ?? 'md';

    return (
        <div className="flex flex-col gap-y-2">
            <BetterTypography as="h3" variant="md" weight="medium">Blur</BetterTypography>

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