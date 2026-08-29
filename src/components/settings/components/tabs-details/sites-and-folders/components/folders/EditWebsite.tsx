import Button from '@/components/ui/Button'
import { PenIcon } from 'lucide-react'
import type { Website } from '../../types'

interface EditWebsiteProps {
    website: Website
    onEdit: (website: Website) => void
}

export default function EditWebsite({ website, onEdit }: EditWebsiteProps) {
    return (
        <Button
            type="button"
            onClick={(e) => {
                e.stopPropagation()
                onEdit(website) // 🌟 Pass the website object to the callback
            }}
            size='icon-sm'
            variant='warning'
            className='hidden transition-colors duration-200 group-hover:inline-flex'
            title="Edit website"
        >
            <PenIcon className='size-4' />
        </Button>
    )
}