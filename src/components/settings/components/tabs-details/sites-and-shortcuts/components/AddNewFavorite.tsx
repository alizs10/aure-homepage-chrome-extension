import Button from '@/components/ui/Button'
import { StarPlusIcon } from 'lucide-react'
import { useState } from 'react'
import FavoriteModal from '../modals/FavoriteModal'

export default function AddNewFavorite() {

    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }


    return (
        <>
            <Button
                leftIcon={<StarPlusIcon className="size-4" />}
                onClick={toggle}
            >
                Add Favorite Website
            </Button>

            {open && (
                <FavoriteModal
                    open={open}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    )
}
