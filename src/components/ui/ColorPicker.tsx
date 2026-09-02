import { cn } from "@/lib/util";
import Button from "./Button";
import { CheckIcon } from "lucide-react";

export interface ColorOption<T extends string = string> {
    id: T;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
}

interface ColorPickerProps<T extends string = string> {
    options: ColorOption<T>[];
    selectedId: T;
    onSelect: (id: T) => void;
}



export default function ColorPicker<T extends string = string>({ options, selectedId, onSelect }: ColorPickerProps<T>) {
    return (
        <div className="flex gap-1 flex-wrap">
            {options.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                    <Button
                        key={option.id}
                        size="icon"
                        variant={isSelected ? "primary-active" : "primary"}
                        type="button"
                        onClick={() => onSelect(option.id)}
                        aria-label={option.label || `Select ${option.id}`}
                        aria-pressed={isSelected}
                    >
                        <div
                            className={cn("size-6 flex-center rounded-full", option.className)}
                            style={option.style}
                        >
                            {isSelected && (
                                <CheckIcon className="size-3.5 text-background" />
                            )}
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}