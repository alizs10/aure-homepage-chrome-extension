import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/Dialog';
import { useSettingsStore } from '@/stores';
import { RotateCcwIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function ResetSettings() {
    const { clear } = useSettingsStore();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleRemove = useCallback(async () => {
        // 1. Wipe DB and Storage
        await clear();

        // 2. Show success message
        toast.info("Settings have been reset successfully");
        setDialogOpen(false);

        // 3. Soft reload the page to reset all in-memory Zustand stores
        window.location.reload();
    }, [clear]);

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                className="w-full"
                variant="destructive"
                size="md"
            >
                <RotateCcwIcon className="size-5" />
                <BetterTypography
                    className="w-full text-start"
                    variant="sm"
                >
                    Reset Settings
                </BetterTypography>
            </Button>

            {/* 🎉 Clean, flat, and highly readable props! */}
            <ConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title="Reset all settings?"
                description="This action will permanently delete all your settings and preferences. This cannot be undone."
                cancelText="Cancel"
                confirmText="Reset settings"
                confirmVariant="destructive"
                onCancel={() => setDialogOpen(false)}
                onConfirm={handleRemove}
            />
        </>
    );
}