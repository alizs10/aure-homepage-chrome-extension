import { SkullIcon } from 'lucide-react'
import { useMemo, useState, type ChangeEvent } from 'react'
import type { Pet } from '../types'
import { usePetHouse } from '../hooks/usePetHouse'
import type { ButtonVariant } from '@/components/common/Button'
import Button from '@/components/common/Button'
import Dialog from '@/components/common/Dialog'

export default function KillPetDialog({ pet }: { pet: Pet }) {

    const { removeItem } = usePetHouse()

    const [confirmKey, setConfirmKey] = useState("")

    function onConfirmKeyChange(e: ChangeEvent<HTMLInputElement>) {
        setConfirmKey(e.target.value)
    }

    const [dialogOpen, setDialogOpen] = useState(false)

    const dialog = useMemo(() => ({
        title: `Killing ${pet.name}???`,
        desc: `You really want to kill ${pet.name}? you can't bring back a dead pet!`,
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        buttons: {
            confirm: {
                content: "Kill it!",
                icon: <SkullIcon className="size-4" />,
                variant: "destructive" as ButtonVariant,
                onConfirm: handleRemove,
                confirmInput: {
                    label: `to confirm, enter: kill ${pet.name}`,
                    value: confirmKey,
                    onChange: onConfirmKeyChange
                }
            },
            cancel: {
                content: "Nooo",
                onCancel: () => {
                    setConfirmKey("")
                    setDialogOpen(false)
                }
            },
        }
    }), [pet.name, confirmKey])


    function handleRemove() {

        if (confirmKey !== `kill ${pet.name}`) {
            setConfirmKey("")
            setDialogOpen(false)
            return
        }

        removeItem(pet.id)
        setDialogOpen(false)

    }


    return (
        <>

            <Button
                onClick={() => setDialogOpen(true)}
                variant="ghost-destructive" size="icon-xs">
                <SkullIcon className="size-4" />
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
