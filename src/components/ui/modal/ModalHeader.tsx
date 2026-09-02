
import { BetterTypography } from '@/components/common/BetterTypography';
import { XIcon } from 'lucide-react';
import Button from '../Button';

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
    hideClose?: boolean;
}

export default function ModalHeader({ onClose, title, hideClose }: ModalHeaderProps) {
    return (
        <div className="relative flex-center-between">
            <BetterTypography as="h4" variant="lg">
                {title}
            </BetterTypography>

            {!hideClose && (
                <Button onClick={onClose} variant='ghost' size='icon'>
                    <XIcon className='size-6' />
                </Button>
            )}
        </div>
    )
}
