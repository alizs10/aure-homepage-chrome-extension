import React from 'react'
import Button from '../common/Button'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Typography } from '../common/Typography'
import useClickOutside from '@/hooks/useOutsideClick'

interface DropdownProps {
    value: {
        label: string
        value: string
    }
    options?: {
        label: string
        value: string
    }[]
    onValueChange?: (value: string) => void
}

export default function Dropdown({ value, options, onValueChange }: DropdownProps) {

    const [isOpen, setIsOpen] = React.useState(false)

    const containerRef = useClickOutside(() => setIsOpen(false))

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }


    return (
        <div className="relative" ref={containerRef}>

            <Button
                rightIcon={isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                variant="primary" size="sm" className="h-auto py-1" onClick={toggleDropdown}>
                <Typography variant="caption-xs" weight="medium">
                    {value.label}
                </Typography>
            </Button>

            {isOpen && (
                <div className="mt-1 absolute top-full left-0 w-full app_container bg-background z-10">
                    <ul className="px-2 py-1.5 space-y-0.5">
                        {options?.map((option) => (
                            <li key={option.value} className="w-full">
                                <Button
                                    onClick={() => {
                                        onValueChange?.(option.value)
                                        setIsOpen(false)
                                    }}
                                    variant={value.value === option.value ? "primary-active" : "ghost"} size="xs" className="w-full text-start">
                                    <Typography variant="caption-xxs" weight="medium"
                                        className="w-full text-start"
                                    >
                                        {option.label}
                                    </Typography>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    )
}
