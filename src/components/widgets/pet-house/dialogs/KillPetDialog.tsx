import { SkullIcon } from 'lucide-react'
import { useMemo, useState, useCallback, type ChangeEvent } from 'react'

import type { Pet } from '../types'
import { usePetHouse } from '../hooks/usePetHouse'
import type { ButtonVariant } from '@/components/common/Button'
import Button from '@/components/common/Button'
import Dialog from '@/components/common/Dialog'
import { toast } from 'sonner'

export default function KillPetDialog({ pet }: { pet: Pet }) {

    const { removeItem } = usePetHouse()

    const [confirmKey, setConfirmKey] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleRemove = useCallback(() => {
        if (confirmKey !== `kill ${pet.name}`) {
            setConfirmKey("")
            setDialogOpen(false)
            return
        }

        removeItem(pet.id)

        // Cool death toast messages
        const deathMessages = [
            `${pet.name} has been sent to the pet afterlife... RIP`,
            `${pet.name} is gone forever. You monster.`,
            `Farewell ${pet.name}. May you rest in peace.`,
            `${pet.name} is gone forever. The Pet House feels emptier now.`,
        ]

        const randomMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)]

        toast.error(randomMessage, {
            duration: 4000,
        })

        setConfirmKey("")
        setDialogOpen(false)
    }, [pet.name, pet.id, confirmKey, removeItem])

    const dialog = useMemo(() => ({
        title: `Killing ${pet.name}???`,
        desc: `You really want to kill ${pet.name}? You can't bring back a dead pet!`,
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
                    onChange: (e: ChangeEvent<HTMLInputElement>) => setConfirmKey(e.target.value)
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
    }), [pet.name, dialogOpen, confirmKey, handleRemove])

    return (
        <>
            <Button
                onClick={() => setDialogOpen(true)}
                variant="ghost-destructive"
                size="icon-xs"
            >
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