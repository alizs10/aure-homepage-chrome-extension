import { useRef, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import ModalWrapper from "@/components/ui/modal/ModalWrapper";
import { db } from "@/lib/db";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { BetterTypography } from "@/components/common/BetterTypography";

interface AddWallpaperModalProps {
    open: boolean;
    onClose: () => void;
    onWallpaperChange: (id: string) => void;
}

export default function AddWallpaperModal({
    open,
    onClose,
    onWallpaperChange,
}: AddWallpaperModalProps) {
    const [useSameImage, setUseSameImage] = useState(true);
    const [lightImage, setLightImage] = useState<string | null>(null);
    const [darkImage, setDarkImage] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadingVariant, setUploadingVariant] = useState<"light" | "dark">("light");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File, variant: "light" | "dark") => {
        setIsUploading(true);

        const reader = new FileReader();

        reader.onload = () => {
            const dataUrl = reader.result as string;

            if (variant === "light") {
                setLightImage(dataUrl);
            } else {
                setDarkImage(dataUrl);
            }

            setIsUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file, "light");
    };

    const handleVariantFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file, uploadingVariant);
    };

    const handleSave = async () => {
        if (!lightImage) return;
        if (!useSameImage && !darkImage) return;

        setIsUploading(true);

        try {
            const wallpaperId = crypto.randomUUID();

            await db.wallpapers.put({
                id: wallpaperId,
                name: "Custom Wallpaper",
                variants: {
                    light: lightImage,
                    dark: useSameImage ? undefined : darkImage!,
                },
            });

            onWallpaperChange(wallpaperId);
            onClose();
        } catch (error) {
            console.error("Failed to save wallpaper to IndexedDB", error);
            toast.error("Failed to save wallpaper");
        } finally {
            setIsUploading(false);
            toast.success("New wallpaper added!");
        }
    };

    const canSave = useSameImage ? !!lightImage : !!lightImage && !!darkImage;

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div className="app_container bg-background p-5 flex flex-col gap-4 w-full max-w-4/5 sm:max-w-md max-h-[80vh] overflow-y-scroll scrollbar-none">
                <ModalHeader title="Add Wallpaper" onClose={onClose} />

                <div className="flex flex-col gap-y-4">
                    <Toggle
                        size="sm"
                        checked={useSameImage}
                        onCheckedChange={setUseSameImage}
                        leftLabel={
                            <BetterTypography variant="sm" weight="medium">
                                Use same image for both modes
                            </BetterTypography>
                        }
                    />

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={useSameImage ? handleSingleFileChange : handleVariantFileChange}
                        accept="image/*"
                        className="sr-only"
                    />

                    {useSameImage ? (
                        <div
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className="aspect-video rounded-3xl bg-secondary/50 border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-y-4 cursor-pointer overflow-hidden relative"
                        >
                            {lightImage ? (
                                <img
                                    src={lightImage}
                                    alt="Wallpaper preview"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <UploadIcon className="size-12 text-muted-foreground" />

                                    <BetterTypography variant="sm" weight="medium">
                                        {isUploading
                                            ? "Processing..."
                                            : "Click to choose a wallpaper"}
                                    </BetterTypography>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-border bg-secondary/50">
                                {darkImage ? (
                                    <img
                                        src={darkImage}
                                        alt="Dark variant"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-start justify-end bg-black">
                                        <BetterTypography
                                            variant="sm"
                                            weight="medium"
                                            className="text-muted-foreground px-2 py-1 rounded mr-4 mt-4"
                                        >
                                            Dark Mode
                                        </BetterTypography>
                                    </div>
                                )}

                                {lightImage ? (
                                    <img
                                        src={lightImage}
                                        alt="Light variant"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        style={{
                                            clipPath:
                                                "polygon(0 0, 0 0, 100% 100%, 0% 100%)",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 flex items-end justify-start bg-white"
                                        style={{
                                            clipPath:
                                                "polygon(0 0, 0 0, 100% 100%, 0% 100%)",
                                        }}
                                    >
                                        <BetterTypography
                                            variant="sm"
                                            weight="medium"
                                            className="text-muted-foreground ml-4 mb-4"
                                        >
                                            Light Mode
                                        </BetterTypography>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setUploadingVariant("light");
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isUploading}
                                    className="flex-1"
                                >
                                    <BetterTypography variant="sm" weight="medium">
                                        {lightImage ? "Change Light" : "Upload Light"}
                                    </BetterTypography>
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setUploadingVariant("dark");
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isUploading}
                                    className="flex-1"
                                >
                                    <BetterTypography variant="sm" weight="medium">
                                        {darkImage ? "Change Dark" : "Upload Dark"}
                                    </BetterTypography>
                                </Button>
                            </div>
                        </>
                    )}

                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleSave}
                        disabled={isUploading || !canSave}
                        className="w-full"
                    >
                        <BetterTypography variant="sm" weight="medium">
                            {isUploading ? "Saving..." : "Save Wallpaper"}
                        </BetterTypography>
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
}