import Button from '@/components/common/Button'
import { PenIcon } from 'lucide-react'
import { useState } from 'react'
import FavoriteModal from '../modals/FavoriteModal'
import type { Favorite } from '../types'

interface EditFavoriteProps {
    favorite: Favorite
}

export default function EditFavorite({ favorite }: EditFavoriteProps) {


    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }


    return (
        <>
            <Button
                onClick={toggle}
                size='icon-sm' variant='warning'>
                <PenIcon className='size-4' />
            </Button>

            {open && (
                <FavoriteModal
                    open={open}
                    onClose={() => setOpen(false)}
                    favorite_id={favorite.id}
                    init_value={{
                        title: favorite.title,
                        url: favorite.url,
                    }}
                />
            )}
        </>
    )
}
