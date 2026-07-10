import { CircleQuestionMarkIcon } from "lucide-react"
import { useState } from "react"
import useClickOutside from "../../../../hooks/useOutsideClick"
import Button from "../../../common/Button"
import { Typography } from "../../../common/Typography"

export default function InfoPopup() {


    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(prev => !prev)
    }

    const containerRef = useClickOutside<HTMLUListElement>(() => setOpen(false))


    return (
        <div ref={containerRef} className="relative z-20">
            <Button onClick={toggle} variant={open ? 'primary-active' : 'ghost'} size='icon-sm'

            >
                <CircleQuestionMarkIcon className='size-5' />

            </Button>

            {open && (
                <div className='flex flex-col justify-start app_container bg-background absolute top-full right-0 h-fit mt-1 rounded-3xl overflow-clip py-3 px-4 w-60'>

                    <Typography variant="caption-xs">
                        To create a checklist item, start your line with <strong>[]</strong> followed by a space.
                    </Typography>

                </div>
            )}
        </div>
    )
}