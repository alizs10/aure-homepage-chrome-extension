import { BetterTypography } from '@/components/common/BetterTypography';
import Checkbox from '@/components/ui/Checkbox';
import ItemFooter from './ItemFooter';
import type { AdvancedNote, TaskBlock } from '../types';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';

interface AdvancedNoteItemProps {
    item: AdvancedNote;
    onToggleTask: (noteId: number, blockId: string) => void;
    date: number;
    edited?: boolean;
}

export function AdvancedNoteItem({ item, onToggleTask, date, edited }: AdvancedNoteItemProps) {
    const { showChecked } = useNotesAndChecklists();

    return (
        <div className="rounded-3xl liquid-glass px-4 py-2 flex flex-col gap-y-3 w-full">
            {item.blocks.map((block) => {
                // Hide completed tasks if showChecked is false
                if (block.type === 'task' && !showChecked && block.status) {
                    return null;
                }

                if (block.type === 'text') {
                    return (
                        <BetterTypography key={block.id} variant="sm" className="wrap-break-word">
                            {block.content}
                        </BetterTypography>
                    );
                }

                if (block.type === 'task') {
                    const task = block as TaskBlock;
                    return (
                        <div key={block.id} className="flex-row-center gap-x-2">
                            <Checkbox
                                checked={!!task.status}
                                onChange={() => onToggleTask(item.id, task.id)}
                                size="md"
                            />
                            <BetterTypography
                                variant="sm"
                                className={`flex-1 wrap-break-word ${task.status ? 'line-through text-muted-foreground' : ''}`}
                            >
                                {task.content}
                            </BetterTypography>
                        </div>
                    );
                }

                return null;
            })}
            <ItemFooter date={date} edited={edited} />
        </div>
    );
}