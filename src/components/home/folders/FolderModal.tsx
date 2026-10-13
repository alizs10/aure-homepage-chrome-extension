import Favicon from '@/components/common/Favicon';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import type { MouseEvent } from 'react';
import type { Website } from '@/features/bookmarks';
import { BetterTypography } from '@/components/common/BetterTypography';

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
                            <a
                                href={w.url}
                                onClick={onClose}
                                className="w-full aspect-square rounded-full liquid-glass flex-center group z-30 relative"
                            >
                                <div className="transition-transform duration-200 group-hover:rotate-12">
                                    <Favicon className='min-w-6 md:min-w-10 size-6 md:size-10' url={w.url} />
                                </div>
                            </a>

                            <BetterTypography variant='xxs' className='line-clamp-1 text-nowrap overflow-hidden text-center text-ellipsis w-full'>
                                {w.title}
                            </BetterTypography>
                        </div>
                    ))}
                </div>
            </div>
        </ModalWrapper>
    );
}