import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'

// Ensures any item passed to this list has the required properties for reordering
export interface OrderableItem {
    id: number
    order: number
}

interface OrderableListProps<T extends OrderableItem> {
    items: T[]
    maxOrder: number
    onSortUp: (id: number) => void
    onSortDown: (id: number) => void
    onRemove: (id: number) => void
    removeToastMessage: string
    emptyMessage: string
    renderLeft: (item: T, index: number) => ReactNode
    renderRight?: (item: T) => ReactNode
}

export function OrderableList<T extends OrderableItem>({
    items,
    maxOrder,
    onSortUp,
    onSortDown,
    onRemove,
    removeToastMessage,
    emptyMessage,
    renderLeft,
    renderRight,
}: OrderableListProps<T>) {
    if (items.length === 0) {
        return (
            <div className='rounded-3xl liquid-glass flex-center py-10'>
                <BetterTypography variant='xs' className='text-secondary-foreground' weight='medium'>
                    {emptyMessage}
                </BetterTypography>
            </div>
        )
    }

    return (
        <motion.ul layout className="flex flex-col gap-y-1">
            {items.map((item, i) => (
                <motion.li
                    key={item.id}
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                    }}
                    className="flex-center-between group"
                >
                    {renderLeft(item, i)}

                    <div className="flex-row-center gap-x-1">
                        <Button
                            className='hidden transition-colors duration-200 group-hover:inline-flex'
                            onClick={() => onSortUp(item.id)}
                            disabled={item.order === 0}
                            size='icon-sm'
                            variant='destructive'
                        >
                            <ChevronUpIcon className='size-4' />
                        </Button>

                        <Button
                            className='hidden transition-colors duration-200 group-hover:inline-flex'
                            onClick={() => onSortDown(item.id)}
                            disabled={maxOrder === item.order}
                            size='icon-sm'
                            variant='destructive'
                        >
                            <ChevronDownIcon className='size-4' />
                        </Button>

                        {renderRight && renderRight(item)}

                        <Button
                            onClick={() => {
                                onRemove(item.id)
                                toast.info(removeToastMessage)
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