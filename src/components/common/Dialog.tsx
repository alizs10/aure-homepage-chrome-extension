import { XIcon } from "lucide-react";
import { Typography } from "../common/Typography";
import type { ChangeEvent, MouseEvent, ReactNode } from "react";
import type { ButtonVariant } from "./Button";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import TextInput from "../Form/TextInput";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    desc?: string;
    buttons: {
        confirm: {
            content: string;
            icon?: ReactNode;
            onConfirm: () => void;
            variant?: ButtonVariant;
            confirmInput?: {
                label: string;
                value: string;
                onChange: (e: ChangeEvent<HTMLInputElement>) => void;
            }
        },
        cancel: {
            content: string;
            icon?: ReactNode;
            onCancel: () => void;
            variant?: ButtonVariant;
        }
    }
}

export default function Dialog({ open, onClose, buttons, title, desc }: DialogProps) {

    function stopPropagation(e: MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
    }


    return (
        <ModalWrapper open={open} onClose={onClose}>
            <div onClick={stopPropagation} className="container p-5 flex flex-col w-full max-w-4/5 sm:max-w-md">



                <div className="flex-center-between">
                    <Typography
                        className='text-center'
                        variant="h2"
                    >
                        {title}
                    </Typography>

                    <Button onClick={onClose} variant='ghost' size='icon'>
                        <XIcon className='size-6' />
                    </Button>
                </div>


                {desc && (

                    <Typography
                        className='mt-4 text-center text-muted-foreground'
                        variant="body"
                    >
                        {desc}
                    </Typography>
                )}


                {buttons.confirm?.confirmInput && (
                    <div className="mt-4">
                        <TextInput
                            className="text-xs placeholder:text-xs placeholder:text-muted-foreground"
                            value={buttons.confirm.confirmInput.value}
                            onChange={buttons.confirm.confirmInput.onChange}
                            placeholder={buttons.confirm.confirmInput.label}
                        />
                    </div>
                )}


                <div className="mt-6 flex flex-wrap gap-x-2">

                    <Button
                        variant={buttons.confirm.variant ?? "primary"}
                        className="flex-1"
                        onClick={buttons.confirm.onConfirm}
                        rightIcon={buttons.confirm?.icon}
                        disabled={buttons.confirm?.confirmInput?.value?.trim().length === 0}
                    >
                        <Typography

                            variant="caption"
                            weight="semibold"
                        >
                            {buttons.confirm.content}
                        </Typography>

                    </Button>

                    <Button
                        onClick={buttons.cancel.onCancel}
                        variant={buttons.cancel.variant ?? "ghost"}
                        className="flex-1"
                        rightIcon={buttons.cancel?.icon}
                    >

                        <Typography

                            variant="caption"
                            weight="semibold"
                        >
                            {buttons.cancel.content}
                        </Typography>
                    </Button>



                </div>
            </div>
        </ModalWrapper>
    )
}