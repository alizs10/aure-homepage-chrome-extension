import Favicon from '@/components/common/Favicon'
import { ItemTooltip } from '@/components/common/ItemTooltip'
import Button from '@/components/ui/Button'
import type { Folder } from '@/components/settings/components/tabs-details/sites-and-folders/types'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import FolderModal from './FolderModal'

interface FolderItemProps {
    folder: Folder
}

export default function FolderItem({ folder }: FolderItemProps) {
    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    const websiteCount = folder.websites.length;
    const subtitle = `${websiteCount} website${websiteCount !== 1 ? 's' : ''}`;

    return (
        <>
            <ItemTooltip title={`${folder.title}'s Folder`} subtitle={subtitle}>

                <Button
                    onClick={toggle}
                    size='icon-sm'
                    variant='primary'
                    className="size-10 md:size-14 w-auto min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square h-auto group z-30 px-0 p-2.5 rounded-full"
                >
                    <div className={`grid aspect-square ${websiteCount === 1 ? "grid-cols-1" : "grid-cols-2"} gap-0.5`}>
                        {folder.websites.slice(0, 3).map(w => (
                            <Favicon key={w.id} url={w.url} className='aspect-square col-span-1' />
                        ))}

                        {websiteCount > 3 && (
                            <div className="col-span-1 aspect-square flex-center text-muted-foreground">
                                <PlusIcon className='size-3.5' />
                            </div>
                        )}
                    </div>
                </Button>
            </ItemTooltip>

            {open && (
                <FolderModal
                    open={open}
                    onClose={() => setOpen(false)}
                    websites={folder.websites}
                    title={folder.title}
                />
            )}
        </>
    )
}