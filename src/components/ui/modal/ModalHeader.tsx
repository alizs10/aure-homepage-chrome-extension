
import { BetterTypography } from '@/components/common/BetterTypography';
import { XIcon } from 'lucide-react';
import Button from '../Button';

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
}

export default function ModalHeader({ onClose, title }: ModalHeaderProps) {
    return (
        <div className="flex-center-between">
            <BetterTypography as="h4" variant="lg">
                {title}
            </BetterTypography>

            <Button onClick={onClose} variant='ghost' size='icon'>
                <XIcon className='size-6' />
            </Button>
        </div>
    )
}
