import Button from '@/components/ui/Button';
import { Typography } from '@/components/common/Typography';
import { useSettingsStore } from '@/stores';
import { RotateCcwIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/Dialog';

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
                <Typography className="w-full text-start" variant="caption">
                    Reset Settings
                </Typography>
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