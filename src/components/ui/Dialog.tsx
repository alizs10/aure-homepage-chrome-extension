import type { ChangeEvent, ReactNode } from "react";
import type { ButtonVariant } from "./Button";
import ModalHeader from "./modal/ModalHeader";
import ModalWrapper from "./modal/ModalWrapper";
import { Typography } from "../common/Typography";
import TextInput from "./TextInput";
import Button from "./Button";

export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;

    // Flattened button props for a much cleaner API
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;

    confirmVariant?: ButtonVariant;
    cancelVariant?: ButtonVariant;
    confirmIcon?: ReactNode;
    cancelIcon?: ReactNode;

    // Optional confirmation input (e.g., typing "DELETE" to confirm)
    confirmInput?: {
        placeholder: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
}

export default function ConfirmDialog({
    open,
    onClose,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    confirmVariant = "primary",
    cancelVariant = "ghost",
    confirmIcon,
    cancelIcon,
    confirmInput,
}: ConfirmDialogProps) {

    // Automatically disable confirm button if input is required but empty
    const isConfirmDisabled = confirmInput ? confirmInput.value.trim().length === 0 : false;

    return (
        <ModalWrapper open={open} onClose={onClose}>
            {/* 🎉 No more stopPropagation hack! Base UI handles click containment natively. */}
            <div className="app_container bg-background p-5 flex flex-col w-full max-w-4/5 sm:max-w-md">

                {/* ModalHeader now handles its own close button via Base UI Dialog.Close */}
                <ModalHeader title={title} onClose={onClose} />

                {description && (
                    <Typography className="mt-4 text-center text-muted-foreground" variant="body">
                        {description}
                    </Typography>
                )}

                {confirmInput && (
                    <div className="mt-4">
                        <TextInput
                            className="text-xs placeholder:text-xs placeholder:text-muted-foreground"
                            value={confirmInput.value}
                            onChange={confirmInput.onChange}
                            placeholder={confirmInput.placeholder}
                        />
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                        onClick={onCancel}
                        variant={cancelVariant}
                        className="flex-1"
                        rightIcon={cancelIcon}
                    >
                        <Typography variant="caption" weight="semibold">
                            {cancelText}
                        </Typography>
                    </Button>

                    <Button
                        onClick={onConfirm}
                        variant={confirmVariant}
                        className="flex-1"
                        rightIcon={confirmIcon}
                        disabled={isConfirmDisabled}
                    >
                        <Typography variant="caption" weight="semibold">
                            {confirmText}
                        </Typography>
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
}