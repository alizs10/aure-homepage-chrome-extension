import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/stores";
import { accentOptions, type Accent } from "@/types";

export default function AccentSection({
    value,
    onChange,
}: {
    value?: Accent;
    onChange?: (val: Accent) => void;
} = {}) {
    const { settings, update } = useSettingsStore();
    const selectedAccent = value !== undefined ? value : (settings?.accent ?? 'default');
    const { resolvedTheme: theme } = useTheme();

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
                            if (onChange) onChange(id);
                            else update({ accent: id });
                        }}
                        leftIcon={
                            <div
                                style={{
                                    background: theme === 'light' ? light : dark
                                }}
                                className="size-3.5 md:size-4 rounded-full"
                            />
                        }
                    >
                        <BetterTypography variant="xs" weight="medium">{label}</BetterTypography>
                    </Button>
                ))}
            </div>
        </div>
    );
}