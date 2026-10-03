// components/notes-and-checklists/InputSection.tsx
import { BetterTypography } from '@/components/common/BetterTypography';
import { PenLineIcon, SendIcon, XIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { sliceText } from '../../../../helpers';
import Button from '../../../ui/Button';
import TextInput from '../../../ui/TextInput';
import TextArea from '../../../ui/TextArea';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';
import type { AdvancedNote } from '../types';

export function InputSection() {
    const [input, setInput] = useState('');
    const [isMultiLine, setIsMultiLine] = useState(false);
    const { addItem, editable, updateItem, cancelEdit } = useNotesAndChecklists();

    const inputRef = useRef<HTMLInputElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const pendingCursorPosRef = useRef<number | undefined>(undefined);

    const isEditingAdvanced = useMemo(() => {
        if (!editable) return false;
        return 'type' in editable && editable.type === 'advanced';
    }, [editable]);

    const editableContent = useMemo(() => {
        if (!editable) return undefined;

        if (isEditingAdvanced) {
            return (editable as AdvancedNote).content;
        }

        if (editable.content.startsWith("[] ")) {
            return editable.content.substring(3);
        }

        return editable.content;
    }, [editable, isEditingAdvanced]);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // 🌟 FIX: Added `editable` to dependency array and guarded the focus calls
    useEffect(() => {
        const cursorPos = pendingCursorPosRef.current;

        // Only focus if we have a cursor position to restore, or if we are actively editing an item.
        // This prevents the input from stealing focus on initial app mount.
        const shouldFocus = cursorPos !== undefined || !!editable;

        if (isMultiLine && textareaRef.current) {
            if (shouldFocus) {
                textareaRef.current.focus();
                if (cursorPos !== undefined) {
                    textareaRef.current.setSelectionRange(cursorPos, cursorPos);
                    pendingCursorPosRef.current = undefined;
                }
            }
            adjustHeight();
        } else if (!isMultiLine && inputRef.current) {
            if (shouldFocus) {
                inputRef.current.focus();
                if (cursorPos !== undefined) {
                    inputRef.current.setSelectionRange(cursorPos, cursorPos);
                    pendingCursorPosRef.current = undefined;
                }
            }
        }
    }, [isMultiLine, editable]);

    useEffect(() => {
        const clearInput = () => {
            setInput('');
            setIsMultiLine(false);
            pendingCursorPosRef.current = undefined; // 🌟 Clear cursor pos on clear
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        };

        const init = () => {
            if (!editable?.content) return;

            setInput(editable.content);

            const hasNewlines = editable.content.includes('\n');
            if (isEditingAdvanced || hasNewlines) {
                setIsMultiLine(true);
            } else {
                setIsMultiLine(false);
            }

            pendingCursorPosRef.current = editable.content.length;
        };

        if (!editable) {
            clearInput();
            return;
        }

        init();
    }, [editable, isEditingAdvanced]);

    const handler = () => {
        if (input.trim()) {
            const hasNewlines = input.includes('\n') && input.trim().split('\n').length > 1;
            const isChecklist = input.startsWith('[] ');

            let type = 'Note';
            if (hasNewlines) {
                type = 'Advanced Note';
            } else if (isChecklist) {
                type = 'Item';
            }

            if (editable) {
                updateItem(input);
                toast.success(`${type} updated successfully!`);
            } else {
                addItem(input);
                toast.success(`${type} added!`);
            }

            setInput('');
            setIsMultiLine(false);
            pendingCursorPosRef.current = undefined; // 🌟 Clear cursor pos on submit
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handler();
        } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            const cursorPos = e.currentTarget.selectionStart ?? input.length;
            const newValue = input.slice(0, cursorPos) + '\n' + input.slice(cursorPos);
            setInput(newValue);
            setIsMultiLine(true);
            pendingCursorPosRef.current = cursorPos + 1;
        }
    };

    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handler();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setInput(newValue);

        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;

            const isTypingAtEnd = e.target.selectionStart === newValue.length;
            if (isTypingAtEnd && textarea.scrollHeight > textarea.clientHeight) {
                textarea.scrollTop = textarea.scrollHeight;
            }
        }

        if (!newValue.includes('\n')) {
            setIsMultiLine(false);
            pendingCursorPosRef.current = e.target.selectionStart ?? undefined;
        }
    };

    return (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-y-2 p-5">
            {(editable && editableContent) && (
                <div className="flex-row-center gap-x-2">
                    <div role='div' className='size-10 min-w-10 rounded-3xl liquid-glass flex-center'>
                        <PenLineIcon className='size-5' />
                    </div>
                    <div className="rounded-3xl liquid-glass flex-1 px-4 py-2">
                        <BetterTypography variant="xs">
                            {sliceText(editableContent, 20)}
                        </BetterTypography>
                    </div>
                    <Button variant='destructive' size='icon' className='' onClick={cancelEdit}>
                        <XIcon className='size-5' />
                    </Button>
                </div>
            )}

            <div className="w-full flex flex-row gap-x-2 items-end">
                <div className="w-full">
                    {!isMultiLine ? (
                        <TextInput
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            placeholder='Shift+Enter for multi-line'
                            className='placeholder:text-muted-foreground text-xs md:text-sm lg:text-base py-0 h-10 app_gradient'
                        />
                    ) : (
                        <TextArea
                            ref={textareaRef}
                            value={input}
                            onChange={handleTextareaChange}
                            onKeyDown={handleTextareaKeyDown}
                            placeholder='Shift+Enter for new line'
                            className='max-h-48 placeholder:text-muted-foreground text-xs md:text-sm lg:text-base app_gradient'
                        />
                    )}
                </div>
                <Button size='icon' className='h-10 min-h-10' onClick={handler}>
                    <SendIcon className='size-4' />
                </Button>
            </div>
        </div>
    );
}