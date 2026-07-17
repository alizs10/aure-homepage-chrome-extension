import { Select } from '@base-ui/react/select';
import { ChevronDownIcon } from 'lucide-react';
import { BetterTypography } from '../common/BetterTypography';
import Button from '../ui/Button';

// 1. Allow T to be string OR number to support values like 0
export interface DropdownProps<T extends string | number> {
    value: T;
    options: readonly { label: string; value: T }[];
    onValueChange?: (value: T) => void;
    placeholder?: string;
}

export default function Dropdown<T extends string | number>({
    value,
    options,
    onValueChange,
    placeholder = "Select..."
}: DropdownProps<T>) {

    // 2. Explicitly find the label using String() comparison.
    // This guarantees that value=0 (number) and value="0" (string) match correctly,
    // and prevents the "falsy 0" bug where `value || placeholder` would fail.
    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    return (
        <Select.Root<T>
            value={value}
            onValueChange={(newValue) => {
                if (newValue !== null) {
                    // 3. HTML selects inherently return strings. If your options use 
                    // numbers (like 0), Base UI might pass "0". We find the original 
                    // option and return its exact typed value to satisfy TypeScript.
                    const matchedOption = options.find(opt => String(opt.value) === String(newValue));
                    if (matchedOption) {
                        onValueChange?.(matchedOption.value);
                    }
                }
            }}
        >
            <Select.Trigger
                render={
                    <Button
                        variant="primary"
                        size="sm"
                        className="h-auto py-1"
                        rightIcon={
                            <Select.Icon className="transition-transform duration-200 data-popup-open:rotate-180">
                                <ChevronDownIcon className="size-4" />
                            </Select.Icon>
                        }
                    />
                }
            >
                <BetterTypography
                    variant="xs"
                    weight="medium"
                    className='text-nowrap'
                >
                    {displayLabel}
                </BetterTypography>
            </Select.Trigger>

            <Select.Portal>
                <Select.Positioner sideOffset={4} align="end">
                    <Select.Popup
                        className="w-fit app_container bg-background z-50 px-2 py-1.5 space-y-0.5 rounded-xl border border-border shadow-lg flex flex-col"
                    >
                        {options.map((option) => (
                            <Select.Item
                                key={String(option.value)} // Safe key for numbers or strings
                                value={option.value}
                                render={
                                    <Button
                                        variant={String(value) === String(option.value) ? "primary-active" : "ghost"}
                                        size="sm"
                                        className="h-auto py-1 px-4 gap-x-1 min-w-0 justify-start"
                                    />
                                }
                            >
                                <Select.ItemText>
                                    <BetterTypography
                                        variant="xs"
                                        weight="medium"
                                        className="w-full text-start text-nowrap"
                                    >
                                        {option.label}
                                    </BetterTypography>
                                </Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}