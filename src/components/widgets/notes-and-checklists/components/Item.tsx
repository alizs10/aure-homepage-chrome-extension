// components/notes-and-checklists/Item.tsx
import { useState, type PropsWithChildren } from 'react';
import { ChecklistItem } from './ChecklistItem';
import { NoteItem } from './NoteItem';
import Button from '../../../common/Button';
import { CopyCheckIcon, CopyIcon, EllipsisIcon, PenIcon, TrashIcon } from 'lucide-react';
import { copyToClipboard } from '../../../../helpers';
import { AnimatePresence, motion } from 'framer-motion';
import type { NoteAndChecklist } from '../types';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';
import useClickOutside from '@/hooks/useOutsideClick';

interface ItemProps {
    item: NoteAndChecklist
    onChange: (id: number) => void;
    index: number;
}

function WrapperWithOptions({ children, item, index }: PropsWithChildren & { item: NoteAndChecklist, index: number }) {

    const { removeItem, startEdit } = useNotesAndChecklists()

    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        if (copied) return


        await copyToClipboard(item.content)
        setCopied(true)

        setTimeout(() => {

            setCopied(false)

        }, 2000)


    }

    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    const optionsContainerRef = useClickOutside(() => setOpen(false))


    return (
        <div
            // onMouseLeave={() => setOpen(false)}

            className='group flex flex-row justify-between items-end gap-2 relative rounded-3xl'>
            {children}

            <div ref={optionsContainerRef} className="relative">

                <Button
                    onClick={toggle}
                    className={`${open ? '' : 'group-hover:opacity-100 opacity-0'}`}
                    size='icon-xs' variant='destructive'>
                    <EllipsisIcon className='size-3' />
                </Button>


                <AnimatePresence mode='wait'>

                    {open && (
                        <motion.div
                            layout
                            className={`absolute ${index > 1 ? 'bottom-full mb-1' : "top-full mt-1"} right-0 transition-all duration-200 w-fit h-fit flex-col flex-center gap-1 app_container rounded-l-none! border-t-0!`}>
                            <motion.div
                                initial={{ x: 50 }}
                                animate={{ x: 0 }}
                                exit={{ x: 50 }}
                                transition={{
                                    delay: .2
                                }}
                            >

                                <Button
                                    onClick={handleCopy}
                                    size='icon' variant='success'>

                                    <AnimatePresence mode="wait" initial={false}>
                                        {copied ? (
                                            <motion.div
                                                key={'copy-check'}
                                                initial={{ y: -25 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: 25 }}
                                                transition={{
                                                    ease: "linear",
                                                    duration: .1
                                                }}
                                            >
                                                <CopyCheckIcon

                                                    className="size-4 text-success" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={'copy'}
                                                initial={{ y: -25 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: 25 }}
                                                transition={{
                                                    ease: "linear",
                                                    duration: .1
                                                }}
                                            >

                                                <CopyIcon className={`size-4`} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ x: 50 }}
                                animate={{ x: 0 }}
                                exit={{ x: 50 }}
                                transition={{
                                    delay: .1
                                }}
                            >



                                <Button
                                    onClick={() => {
                                        startEdit(item.id)
                                        setOpen(false)
                                    }}
                                    size='icon' variant='warning'>
                                    <PenIcon className='size-4' />
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ x: 50 }}
                                animate={{ x: 0 }}
                                exit={{ x: 50 }}
                                transition={{
                                    delay: 0
                                }}
                            >

                                <Button
                                    onClick={() => {
                                        removeItem(item.id)
                                        setOpen(false)
                                    }}
                                    size='icon' variant='destructive'>
                                    <TrashIcon className='size-4' />
                                </Button>
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

        </div>
    )

}


export function Item({ item, onChange, index }: ItemProps) {
    const isChecklist = item.content.startsWith("[] ");

    const content = isChecklist ? (
        <ChecklistItem item={item} onChange={onChange} date={item.updatedAt} edited={item.createdAt !== item.updatedAt} />
    ) : (
        <NoteItem content={item.content} date={item.updatedAt} edited={item.createdAt !== item.updatedAt} />
    );

    return (
        <WrapperWithOptions item={item} index={index}>
            {content}
        </WrapperWithOptions>
    );
}