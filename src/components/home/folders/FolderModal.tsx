import Favicon from '@/components/common/Favicon';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import { Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
// 🌟 Use the shared type from settings
import type { Website } from '@/components/settings/components/tabs-details/sites-and-folders/types';

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
                className="rounded-3xl app_shadow bg-secondary p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none"
            >
                <ModalHeader
                    title={`${title}'s Folder`}
                    onClose={onClose}
                />

                <div className='grid grid-cols-6 gap-2'>
                    {websites.map(w => (
                        <Link
                            key={w.id} // 🌟 Added missing key prop
                            to={w.url}
                            onClick={onClose} // 🌟 UX Improvement: Close modal when a site is clicked
                            className={`col-span-1 aspect-square rounded-full rounded-3xl app_shadow app_gradient app-blur flex-center group z-30 relative`}
                        >
                            <div className="transition-transform duration-200 group-hover:rotate-12">
                                <Favicon className='min-w-6 md:min-w-10 size-6 md:size-10' url={w.url} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </ModalWrapper>
    )
}