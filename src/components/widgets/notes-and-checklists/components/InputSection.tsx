// components/notes-and-checklists/InputSection.tsx
import { PenLineIcon, PlusIcon, SendIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextInput from '../../../Form/TextInput';
import { useNotesAndChecklists } from '../contexts/NotesAndChecklistsContext';
import Button from '../../../common/Button';
import { Typography } from '../../../common/Typography';
import { sliceText } from '../../../../helpers';

export function InputSection() {
    const [input, setInput] = useState('');
    const { addItem, editable, updateItem, cancelEdit } = useNotesAndChecklists();

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {

        if (!editable) {

            setInput("")

            return
        }

        setInput(editable.content)
        if (!inputRef.current) return
        inputRef.current.focus()

    }, [editable])

    // const handleAdd = () => {
    //     if (input.trim()) {
    //         addItem(input);
    //         setInput('');
    //     }
    // };

    const handler = () => {
        if (input.trim()) {

            editable ? updateItem(input) : addItem(input);

            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            handler();
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {editable && (
                <div className="flex-row-center gap-x-2">

                    <div role='div' className='size-10 min-w-10 app_container app_gradient backdrop-blur-md flex-center'>
                        <PenLineIcon className='size-5' />
                    </div>
                    <div className="app_container app_gradient flex-1 backdrop-blur-md px-4 py-2">
                        <Typography className='' variant='body'>
                            {sliceText(editable.content, 15)}
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
                        className='placeholder:text-muted-foreground text-base placeholder:text-base'
                    />
                </div>
                <Button size='icon' className='h-full' onClick={handler}>
                    <SendIcon className='size-5' />
                </Button>
            </div>
        </div>
    );
}