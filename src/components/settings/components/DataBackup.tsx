import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { exportUserData, importUserData } from "@/lib/backup";
import { useSettingsStore } from "@/stores";
import { DownloadIcon, UploadIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

export default function DataBackup() {
    const username = useSettingsStore(s => s.settings?.name)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleExport = async () => {
        try {
            await exportUserData(username);
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    const handleImportClick = () => {
        if (importStatus === 'idle') {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportStatus('loading');
        setErrorMessage("");

        const MIN_LOADING_TIME = 1500; // Minimum time to show the loading state
        const startTime = Date.now();

        try {
            await importUserData(file);

            // ✅ Enforce minimum loading time for success
            const elapsed = Date.now() - startTime;
            if (elapsed < MIN_LOADING_TIME) {
                await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsed));
            }

            setImportStatus('success');

            // Delay reload so the user sees the success state animation and message
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            // ✅ Enforce minimum loading time for error (prevents instant flash to error state)
            const elapsed = Date.now() - startTime;
            if (elapsed < MIN_LOADING_TIME) {
                await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsed));
            }

            console.error("Import failed:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            setErrorMessage(message);
            setImportStatus('error');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // ✅ React Portal ensures the overlay is attached to document.body
    const overlayContent = importStatus !== 'idle' ? createPortal(
        <div
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-secondary dark:bg-background"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-status-title"
        >
            <div className="liquid-glass p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={importStatus}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="flex flex-col items-center gap-4 w-full"
                    >
                        {importStatus === 'loading' && (
                            <>
                                <Loader2 className="size-10 animate-spin text-primary" />
                                <div className="flex flex-col gap-y-1">
                                    <BetterTypography variant="md" weight="semibold">
                                        Importing Data...
                                    </BetterTypography>
                                    <BetterTypography variant="sm" className="text-muted-foreground">
                                        Please do not close this window.
                                    </BetterTypography>
                                </div>
                            </>
                        )}

                        {importStatus === 'success' && (
                            <>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                >
                                    <CheckCircle2 className="size-10 text-success" />
                                </motion.div>
                                <div className="flex flex-col gap-y-1">
                                    <BetterTypography variant="md" weight="semibold">
                                        Import Successful!
                                    </BetterTypography>
                                    <BetterTypography variant="sm" className="text-muted-foreground">
                                        Reloading application...
                                    </BetterTypography>
                                </div>
                            </>
                        )}

                        {importStatus === 'error' && (
                            <>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                >
                                    <XCircle className="size-10 text-destructive" />
                                </motion.div>
                                <div className="flex flex-col gap-y-1">
                                    <BetterTypography variant="md" weight="semibold">
                                        Import Failed
                                    </BetterTypography>
                                    <BetterTypography variant="sm" className="text-muted-foreground mb-2">
                                        {errorMessage}
                                    </BetterTypography>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => setImportStatus('idle')}
                                    className="w-full"
                                >
                                    Try Again
                                </Button>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="flex flex-col gap-2 md:gap-4">
            {overlayContent}

            <div className="space-y-1">
                <BetterTypography variant="md" weight="semibold">
                    Backup & Restore
                </BetterTypography>

                <BetterTypography variant="sm" className="text-muted-foreground">
                    Export your settings, widgets, and data to a file, or restore from a previous backup.
                </BetterTypography>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 md:gap-3">
                <Button
                    leftIcon={<DownloadIcon className="size-4" />}
                    variant="primary"
                    onClick={handleExport}
                    size="sm"
                    disabled={importStatus === 'loading'}
                >
                    <BetterTypography variant="sm">Export Data</BetterTypography>
                </Button>

                <Button
                    leftIcon={importStatus === 'loading' ? <Loader2 className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
                    variant="primary"
                    onClick={handleImportClick}
                    size="sm"
                    disabled={importStatus === 'loading'}
                >
                    <BetterTypography variant="sm">
                        {importStatus === 'loading' ? "Importing..." : "Import Data"}
                    </BetterTypography>
                </Button>
            </div>

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