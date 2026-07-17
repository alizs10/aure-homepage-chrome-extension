
import { Typography } from '@/components/common/Typography';
import { XIcon } from 'lucide-react'
import Button from '../Button';

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
