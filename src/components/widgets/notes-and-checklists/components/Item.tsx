// components/notes-and-checklists/Item.tsx
import { useState, type PropsWithChildren } from 'react';
import { ChecklistItem } from './ChecklistItem';
import { NoteItem } from './NoteItem';
import Button from '../../../common/Button';
import { CopyCheckIcon, CopyIcon, PenIcon, TrashIcon } from 'lucide-react';
import { copyToClipboard } from '../../../../helpers';
import { AnimatePresence, motion } from 'framer-motion';
import type { NoteAndChecklist } from '../types';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';

interface ItemProps {
    item: NoteAndChecklist
    onChange: (id: number) => void;
}

function WrapperWithOptions({ children, item }: PropsWithChildren & { item: NoteAndChecklist }) {

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


    return (
        <div className='group flex flex-row relative overflow-clip rounded-3xl'>
            {children}

            <div className="absolute inset-0 top-auto left-auto transition-all duration-200 w-0 group-hover:w-32 h-fit flex-center gap-1 overflow-clip app_container rounded-l-none! border-t-0!">
                <Button
                    onClick={handleCopy}
                    // disabled={copied}
                    size='icon' variant='success'>
                    {/* <CopyIcon className='size-4' /> */}

                    <AnimatePresence mode="wait">
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
                <Button
                    onClick={() => startEdit(item.id)}
                    size='icon' variant='warning'>
                    <PenIcon className='size-4' />
                </Button>
                <Button
                    onClick={() => removeItem(item.id)}
                    size='icon' variant='destructive'>
                    <TrashIcon className='size-4' />
                </Button>
            </div>
        </div>
    )

}


export function Item({ item, onChange }: ItemProps) {
    const isChecklist = item.content.startsWith("[] ");

    const content = isChecklist ? (
        <ChecklistItem item={item} onChange={onChange} date={item.updatedAt} edited={item.createdAt !== item.updatedAt} />
    ) : (
        <NoteItem content={item.content} date={item.updatedAt} edited={item.createdAt !== item.updatedAt} />
    );

    return (
        <WrapperWithOptions item={item}>
            {content}
        </WrapperWithOptions>
    );
}