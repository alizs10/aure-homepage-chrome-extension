import Button from '@/components/ui/Button'
import { FolderPenIcon } from 'lucide-react'
import { useState } from 'react'
import type { Folder } from '../../types'
import ManageFolderModal from './modals/ManageFolderModal'

interface ManageFolderProps {
    folder: Folder
}

export default function ManageFolder({ folder }: ManageFolderProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size='icon-sm'
                variant='primary'
                className='hidden transition-colors duration-200 group-hover:inline-flex'
                title="Manage websites in this folder"
            >
                <FolderPenIcon className='size-4' />
            </Button>

            {open && (
                <ManageFolderModal
                    open={open}
                    onClose={() => setOpen(false)}
                    folder={folder}
                />
            )}
        </>
    )
}