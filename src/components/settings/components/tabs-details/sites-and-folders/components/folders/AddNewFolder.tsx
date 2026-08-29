import Button from '@/components/ui/Button'
import { FolderPlusIcon } from 'lucide-react'
import { useState } from 'react'
import FolderModal from './modals/FolderModal'

export default function AddNewFolder() {
    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    return (
        <>
            <Button
                leftIcon={<FolderPlusIcon className="size-4" />}
                onClick={toggle}
            >
                Add Folder
            </Button>

            {open && (
                <FolderModal
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    )
}