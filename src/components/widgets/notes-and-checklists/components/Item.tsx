// components/notes-and-checklists/Item.tsx
import { useState, type PropsWithChildren } from 'react';
import { ChecklistItem } from './ChecklistItem';
import { NoteItem } from './NoteItem';
import { AdvancedNoteItem } from './AdvancedNoteItem';
import Button from '../../../ui/Button';
import { CopyCheckIcon, CopyIcon, EllipsisIcon, PenIcon, TrashIcon } from 'lucide-react';
import { copyToClipboard } from '../../../../helpers';
import { AnimatePresence, motion } from 'framer-motion';
import type { AdvancedNote, Checklist, NoteAndChecklist } from '../types';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';
import useClickOutside from '@/hooks/useOutsideClick';
import { toast } from '@/stores/useToastStore';

interface ItemProps {
    item: NoteAndChecklist
    onChange: (id: number) => void;
    index: number;
}

// 🌟 Helper to extract readable text for clipboard
function getClipboardText(item: NoteAndChecklist): string {
    if ('type' in item && item.type === 'advanced') {
        // Return the raw content which already contains the newlines and "[] " prefixes
        return item.content;
    }
    return item.content;
}

function WrapperWithOptions({ children, item, index }: PropsWithChildren & { item: NoteAndChecklist, index: number }) {

    const { removeItem, startEdit } = useNotesAndChecklists()

    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        if (copied) return

        const textToCopy = getClipboardText(item);
        await copyToClipboard(textToCopy)
        setCopied(true)
        toast.success("Copied!")

        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    const optionsContainerRef = useClickOutside(() => setOpen(false))

    function handleRemove(id: number) {
        const isAdvanced = 'type' in item && item.type === 'advanced';
        const isChecklist = !isAdvanced && item.content.startsWith("[] ");

        let type = 'Note';
        if (isAdvanced) type = 'Advanced Note';
        else if (isChecklist) type = 'Item';

        removeItem(id)
        toast.success(`${type} deleted!`)
    }

    return (
        <div className='group flex flex-row justify-between items-end gap-2 relative rounded-3xl w-full'>
            {children}

            <div ref={optionsContainerRef} className="relative">
                <Button
                    onClick={toggle}
                    className={`${open ? '' : 'group-hover:opacity-100 opacity-0'}`}
                    size='icon-xs'
                    variant={open ? 'primary-active' : 'primary'}
                >
                    <EllipsisIcon className='size-3' />
                </Button>

                <AnimatePresence mode='wait'>
                    {open && (
                        <motion.div
                            layout
                            className={`absolute ${index > 1 ? 'bottom-full mb-1' : "top-full mt-1"} right-0 w-fit h-fit flex-col flex-center gap-1 z-50`}
                        >
                            <motion.div
                                initial={{ x: 50 }}
                                animate={{ x: 0 }}
                                exit={{ x: 50 }}
                                transition={{ delay: .2 }}
                            >
                                <Button onClick={handleCopy} size='icon' variant='success'>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {copied ? (
                                            <motion.div
                                                key={'copy-check'}
                                                initial={{ y: -25 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: 25 }}
                                                transition={{ ease: "linear", duration: .1 }}
                                            >
                                                <CopyCheckIcon className="size-4 text-success" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={'copy'}
                                                initial={{ y: -25 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: 25 }}
                                                transition={{ ease: "linear", duration: .1 }}
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
                                transition={{ delay: .1 }}
                            >
                                <Button
                                    onClick={() => {
                                        startEdit(item.id)
                                        setOpen(false)
                                    }}
                                    size='icon'
                                    variant='warning'
                                >
                                    <PenIcon className='size-4' />
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ x: 50 }}
                                animate={{ x: 0 }}
                                exit={{ x: 50 }}
                                transition={{ delay: 0 }}
                            >
                                <Button
                                    onClick={() => {
                                        handleRemove(item.id)
                                        setOpen(false)
                                    }}
                                    size='icon'
                                    variant='destructive'
                                >
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
    const { toggleAdvancedTask } = useNotesAndChecklists();

    const isAdvanced = 'type' in item && item.type === 'advanced';
    const isChecklist = !isAdvanced && item.content.startsWith("[] ");

    let content;

    if (isAdvanced) {
        content = (
            <AdvancedNoteItem
                item={item as AdvancedNote}
                onToggleTask={toggleAdvancedTask}
                date={item.updatedAt}
                edited={item.createdAt !== item.updatedAt}
            />
        );
    } else if (isChecklist) {
        content = (
            <ChecklistItem
                item={{
                    id: item.id,
                    content: item.content,
                    status: (item as Checklist).status
                }}
                onChange={onChange}
                date={item.updatedAt}
                edited={item.createdAt !== item.updatedAt}
            />
        );
    } else {
        content = (
            <NoteItem
                content={item.content}
                date={item.updatedAt}
                edited={item.createdAt !== item.updatedAt}
            />
        );
    }

    return (
        <WrapperWithOptions item={item} index={index}>
            {content}
        </WrapperWithOptions>
    );
}