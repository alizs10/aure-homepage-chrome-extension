import { Typography } from '../common/Typography'
import Button from '../common/Button'
import { XIcon } from 'lucide-react'

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
}

export default function ModalHeader({ onClose, title }: ModalHeaderProps) {
    return (
        <div className="flex-center-between">
            <Typography variant="h2">{title}</Typography>

            <Button onClick={onClose} variant='ghost' size='icon'>
                <XIcon className='size-6' />
            </Button>
        </div>
    )
}
