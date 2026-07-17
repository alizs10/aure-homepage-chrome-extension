import Button from "@/components/ui/Button";
import { Typography } from "@/components/common/Typography";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { useRef } from "react";
import { exportUserData, importUserData } from "@/lib/backup";
import { toast } from "sonner";
import { useSettingsStore } from "@/stores";

export default function DataBackup() {
    const username = useSettingsStore(s => s.settings?.name)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        try {
            await exportUserData(username);
            toast.success("Data exported successfully!");
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export data. Please try again.");
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Show a loading toast that we will update later
            toast.loading("Importing data...", { id: "backup-import" });

            await importUserData(file);

            // Update the loading toast to success
            toast.success("Data imported successfully! Reloading app...", { id: "backup-import" });

            // Delay reload so the user can actually see the success message
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Import failed:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";

            // ✅ FIX: Pass the same ID to replace the loading toast with the error toast
            toast.error(`Import failed: ${message}`, { id: "backup-import" });
        } finally {
            // Reset the input value so the user can import the exact same file again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-1">
                <Typography variant="body" weight="semibold">
                    Backup & Restore
                </Typography>
                <Typography variant="body-sm" className="text-muted-foreground">
                    Export your settings, widgets, and data to a file, or restore from a previous backup.
                </Typography>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    leftIcon={<DownloadIcon className="size-4" />}
                    variant="primary"
                    onClick={handleExport}
                    size="sm"
                >
                    <Typography variant="body-sm">Export Data</Typography>
                </Button>

                <Button
                    leftIcon={<UploadIcon className="size-4" />}
                    variant="primary"
                    onClick={handleImportClick}
                    size="sm"
                >
                    <Typography variant="body-sm">Import Data</Typography>
                </Button>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}