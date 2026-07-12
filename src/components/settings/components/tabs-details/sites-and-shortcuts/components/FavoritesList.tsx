import Button from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion' // Import motion
import { useFavorites } from '../hooks/useFavorites'
import EditFavorite from './EditFavorite'

export default function FavoritesList() {
    const { data, removeItem, sortUp, sortDown, maxOrder } = useFavorites()

    return (
        <motion.ul
            layout // Optional: animates the container if its size changes
            className="flex flex-col gap-y-1"
        >
            {data.map((f, i) => (
                <motion.li
                    key={f.id}
                    layout // This is the magic prop that animates position changes
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                    }}
                    className="flex-center-between group"
                >
                    <Typography className='line-clamp-1' variant="body-sm" weight="medium">
                        {i + 1}. {f.title}<span className="text-muted-foreground font-normal">{` (${f.url})`}</span>
                    </Typography>

                    <div className="flex-row-center gap-x-1">
                        <Button
                            className='hidden transition-all duration-200 group-hover:inline-flex'
                            onClick={() => sortUp(f.id)}
                            disabled={f.order === 0}
                            size='icon-sm'
                            variant='destructive'
                        >
                            <ChevronUpIcon className='size-4' />
                        </Button>

                        <Button
                            className='hidden transition-all duration-200 group-hover:inline-flex'
                            onClick={() => sortDown(f.id)}
                            disabled={maxOrder === f.order}
                            size='icon-sm'
                            variant='destructive'
                        >
                            <ChevronDownIcon className='size-4' />
                        </Button>

                        <EditFavorite favorite={f} />

                        <Button
                            onClick={() => {
                                removeItem(f.id)
                                toast.info("Favorite deleted!")
                            }}
                            size='icon-sm'
                            variant='destructive'
                        >
                            <TrashIcon className='size-4' />
                        </Button>
                    </div>
                </motion.li>
            ))}
        </motion.ul>
    )
}