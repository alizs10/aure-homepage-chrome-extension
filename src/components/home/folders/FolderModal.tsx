import Favicon from '@/components/common/Favicon';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import type { MouseEvent } from 'react';
import type { Website } from '@/features/bookmarks';
import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';

interface FolderModalProps {
    open: boolean;
    onClose: () => void;
    websites: Website[];
    title: string;
}

export default function FolderModal({ title, websites, open, onClose }: FolderModalProps) {

    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div
                onClick={stopPropagation}
                className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={`${title}'s Folder`}
                    onClose={onClose}
                />

                <div className='grid grid-cols-6 gap-2'>
                    {websites.map(w => (
                        <div key={w.id} className="flex flex-center flex-col gap-y-1.5 col-span-1 overflow-x-hidden">
                            <Button
                                href={w.url}
                                onClick={onClose}
                                variant="primary"
                                className="min-w-full w-full h-auto aspect-square group z-30 px-0 rounded-full pointer-events-auto"
                            >
                                <div className="transition-transform duration-200 group-hover:rotate-12 size-full p-3">
                                    <Favicon className="size-full" url={w.url} />
                                </div>
                            </Button>

                            <BetterTypography variant='xxs' className='text-center truncate w-full'>
                                {w.title}
                            </BetterTypography>
                        </div>
                    ))}
                </div>
            </div>
        </ModalWrapper>
    );
}