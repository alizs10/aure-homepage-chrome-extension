// components/notes-and-checklists/InputSection.tsx
import { PenLineIcon, SendIcon, XIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sliceText } from '../../../../helpers';
import TextInput from '../../../Form/TextInput';
import Button from '../../../common/Button';
import { Typography } from '../../../common/Typography';
import { useNotesAndChecklists } from '../hooks/useNotesAndChecklists';
import { toast } from 'sonner';

export function InputSection() {
    const [input, setInput] = useState('');
    const { addItem, editable, updateItem, cancelEdit } = useNotesAndChecklists();

    const isChecklist = useMemo(() => {

        if (!input) return false;

        return input.startsWith("[] ");
    }, [input])

    const editableContent = useMemo(() => {

        if (!editable) return undefined

        if (!isChecklist) return editable.content;

        return editable.content.substring(3, editable.content.length);

    }, [editable, isChecklist])


    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {

        const clearInput = () => {
            setInput('')
        }

        const init = () => {

            if (!editable?.content) return

            setInput(editable.content)
            if (!inputRef.current) return
            inputRef.current.focus()
        }


        if (!editable) {

            clearInput()
            return
        }

        init()

    }, [editable])


    const handler = () => {
        if (input.trim()) {

            const type = isChecklist ? 'Item' : 'Note'

            if (editable) {
                updateItem(input)
                toast.success(`${type} updated successfully!`)

            } else {
                addItem(input);
                toast.success(`${type} added!`)
            }

            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            handler();
        }
    };

    return (
        <div className="fixed inset-0 top-auto flex flex-col gap-y-2 p-5">
            {(editable && editableContent) && (
                <div className="flex-row-center gap-x-2">

                    <div role='div' className='size-10 min-w-10 app_container app_gradient app-blur flex-center'>
                        <PenLineIcon className='size-5' />
                    </div>
                    <div className="app_container app_gradient flex-1 app-blur px-4 py-2">
                        <Typography className='' variant='body'>
                            {sliceText(editableContent, 15)}
                        </Typography>
                    </div>
                    <Button variant='destructive' size='icon' className='' onClick={cancelEdit}>
                        <XIcon className='size-5' />
                    </Button>

                </div>
            )}

            <div className="w-full flex flex-row gap-x-2">



                <div className="w-full">
                    <TextInput
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Type here...'
                        className='placeholder:text-muted-foreground text-xs md:text-sm lg:text-base placeholder:text-base'
                    />
                </div>
                <Button size='icon' className='h-full' onClick={handler}>
                    <SendIcon className='size-5' />
                </Button>
            </div>
        </div>
    );
}