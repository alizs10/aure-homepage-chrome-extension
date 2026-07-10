import { CircleQuestionMarkIcon } from "lucide-react"
import { useState } from "react"
import useClickOutside from "../../../../hooks/useOutsideClick"
import Button from "../../../common/Button"
import { Typography } from "../../../common/Typography"

const listOfInfo = [
    {
        id: 1,
        label: "Max age",
        value: "Cats: 10 years • Dogs: 15 years",
    },
    {
        id: 2,
        label: "Time",
        value: "1 real day = 1 pet year",
    },
    {
        id: 3,
        label: "Feeding",
        value: "Feed each pet 3 times per day",
    },
    {
        id: 4,
        label: "Death",
        value: "Pets can die from starvation or old age",
    },
];

export default function InfoPopup() {


    const [open, setOpen] = useState(false)

    // const router = useRouter()

    function toggle() {
        setOpen(prev => !prev)
    }

    const containerRef = useClickOutside<HTMLUListElement>(() => setOpen(false))


    return (
        <div ref={containerRef} className="relative z-20">
            <Button onClick={toggle} variant={open ? 'primary-active' : 'ghost'} size='icon-sm'
            >
                <CircleQuestionMarkIcon className='size-4' />

            </Button>

            {open && (
                <ul className='flex flex-col justify-start app_container bg-background absolute top-full right-0 h-fit mt-1 rounded-3xl overflow-clip py-3 px-4'>
                    {listOfInfo.map(item => (
                        <li key={item.id} className='py-1'>

                            <Typography className='text-nowrap' variant='caption-xs'>
                                {item.label}: {item.value}
                            </Typography>


                        </li>
                    ))}


                </ul>
            )}
        </div>
    )
}