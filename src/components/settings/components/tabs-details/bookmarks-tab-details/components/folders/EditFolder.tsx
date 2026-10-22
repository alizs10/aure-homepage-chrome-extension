import Button from '@/components/ui/Button'
import { PenIcon } from 'lucide-react'
import { useState } from 'react'
import FolderModal from './modals/FolderModal'
import type { Folder } from '../../types'

interface EditFolderProps {
    folder: Folder
}

export default function EditFolder({ folder }: EditFolderProps) {
    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    return (
        <>
            <Button
                onClick={toggle}
                size='icon-sm'
                variant='warning'
            >
                <PenIcon className='size-4' />
            </Button>

            {open && (
                <FolderModal
                    open={open}
                    onClose={() => setOpen(false)}
                    folder_id={folder.id}
                    init_value={{
                        title: folder.title,
                        websites: folder.websites,
                    }}
                />
            )}
        </>
    )
}