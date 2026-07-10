import Button, { type ButtonVariant } from '@/components/common/Button'
import Dialog from '@/components/common/Dialog'
import { Typography } from '@/components/common/Typography'
import { useSettingsStore } from '@/stores'
import { RotateCcwIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function ResetSettings() {

    const { clear } = useSettingsStore()

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleRemove = useCallback(() => {
        clear()
        toast.info("Settings have been reset successfully")
        setDialogOpen(false)
    }, [clear])

    const dialog = useMemo(() => ({
        title: `Reset all settings?`,
        desc: `This action will permanently delete all your settings and preferences. This cannot be undone.`,
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        buttons: {
            confirm: {
                content: "Reset settings",
                // icon: <SkullIcon className="size-4" />,
                variant: "destructive" as ButtonVariant,
                onConfirm: handleRemove,
            },
            cancel: {
                content: "Cancel",
                onCancel: () => {
                    setDialogOpen(false)
                }
            },
        }
    }), [dialogOpen, handleRemove])

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                className="w-full"
                variant="destructive"
                size="md"
            >
                <RotateCcwIcon className="size-5" />
                <Typography className="w-full text-start" variant="caption">Reset Settings</Typography>
            </Button>

            {dialogOpen && (
                <Dialog
                    title={dialog.title}
                    desc={dialog.desc}
                    open={dialog.open}
                    onClose={dialog.onClose}
                    buttons={dialog.buttons}
                />
            )}
        </>
    )
}