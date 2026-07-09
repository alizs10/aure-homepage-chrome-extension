// components/notes-and-checklists/ChecklistItem.tsx
import Button from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import { CircleCheckIcon, CircleIcon } from 'lucide-react';
import ItemFooter from './ItemFooter';
import { AnimatePresence, motion } from 'framer-motion';


interface ChecklistItemProps {
    item: {
        content: string;
        status?: boolean;
        id: number;
    };
    onChange: (id: number) => void;
    date: number;
    edited?: boolean;
}

export function ChecklistItem({ item, onChange, date, edited }: ChecklistItemProps) {
    const content = item.content.substring(3, item.content.length);

    return (
        <div className="flex-row-center gap-x-1">
            <Button className='overflow-clip' variant='success' onClick={() => onChange(item.id)} size='icon'>
                <AnimatePresence mode="wait" initial={false}>

                    {item.status ? (
                        <motion.div
                            key={'circle-check'}
                            initial={{ y: -25 }}
                            animate={{ y: 0 }}
                            exit={{ y: 25 }}
                            transition={{
                                ease: "linear",
                                duration: .1
                            }}
                        >

                            <CircleCheckIcon className='size-5 text-success' />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={'circle'}
                            initial={{ y: -25 }}
                            animate={{ y: 0 }}
                            exit={{ y: 25 }}
                            transition={{
                                ease: "linear",
                                duration: .1
                            }}
                        >
                            <CircleIcon className='size-5' />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>
            <div className="app_container bg-background  min-w-2/3 flex-1 px-4 py-2 flex flex-col gap-y-2">
                <Typography className={`${item.status ? 'line-through' : ''}`} variant='body-sm'>
                    {content}
                </Typography>
                <ItemFooter date={date} edited={edited} />

            </div>
        </div>
    );
}