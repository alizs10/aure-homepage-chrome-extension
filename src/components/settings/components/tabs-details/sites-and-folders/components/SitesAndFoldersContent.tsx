import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { useSettingsStore } from "@/stores";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import FavoritesContent from "./favorites/FavoritesContent";
import FoldersContent from "./folders/FoldersContent";

interface FormValues {
    show_top_sites: boolean;
    show_favorites: boolean;
    show_folders: boolean;
}

export default function SitesAndFoldersContent() {
    const { settings, update } = useSettingsStore();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting, isValid },
    } = useForm<FormValues>({
        defaultValues: {
            show_top_sites: settings?.show_top_sites ?? true,
            show_favorites: settings?.show_favorites ?? true,
            show_folders: settings?.show_folders ?? true,
        },
    });

    useEffect(() => {
        reset({
            show_top_sites: settings?.show_top_sites ?? true,
            show_favorites: settings?.show_favorites ?? true,
            show_folders: settings?.show_folders ?? true,
        });
    }, [settings, reset]);

    const onSubmit = async (data: FormValues) => {
        await update(data);
        toast.success("Settings updated!");
        reset(data);
    };

    return (
        <div className="h-fit flex-1 flex flex-col gap-y-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-2"
            >
                <Controller
                    name="show_top_sites"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Toggle
                            checked={value}
                            onCheckedChange={onChange}
                            leftLabel={
                                <BetterTypography variant="sm" weight="medium">
                                    Show top sites?
                                </BetterTypography>
                            }
                        />
                    )}
                />

                <Controller
                    name="show_favorites"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Toggle
                            checked={value}
                            onCheckedChange={onChange}
                            leftLabel={
                                <BetterTypography variant="sm" weight="medium">
                                    Show favorite websites?
                                </BetterTypography>
                            }
                        />
                    )}
                />

                <Controller
                    name="show_folders"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Toggle
                            checked={value}
                            onCheckedChange={onChange}
                            leftLabel={
                                <BetterTypography variant="sm" weight="medium">
                                    Show folders?
                                </BetterTypography>
                            }
                        />
                    )}
                />

                <div className="mt-6 w-full flex justify-end">
                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                        variant="primary-active"
                        size="sm"
                    >
                        <BetterTypography variant="sm">
                            Save Changes
                        </BetterTypography>
                    </Button>
                </div>
            </form>

            <FavoritesContent />
            <FoldersContent />
        </div>
    );
}