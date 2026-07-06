import { ChartNoAxesColumnIcon, CircleQuestionMarkIcon } from "lucide-react"
import { useMemo, useState } from "react"
import useClickOutside from "../../../../hooks/useOutsideClick"
import Button from "../../../common/Button"
import { Typography } from "../../../common/Typography"
import { usePetHouse } from "../hooks/usePetHouse"



export default function StatsPopup() {

    const { data: pets, alivePets, catPets, dogPets } = usePetHouse()

    const [open, setOpen] = useState(false)

    const stats = useMemo(() => {

        return [
            {
                id: 1,
                label: "All Pets",
                value: pets.length,
            },
            {
                id: 2,
                label: "Alive Pets",
                value: alivePets.length,
            },
            {
                id: 3,
                label: "Dead Pets",
                value: pets.length - alivePets.length,
            },
            {
                id: 4,
                label: "Cats",
                value: catPets.length,
            },
            {
                id: 5,
                label: "Dogs",
                value: dogPets.length,
            },
        ];

    }, [pets, alivePets])

    // const router = useRouter()

    function toggle() {
        setOpen(prev => !prev)
    }

    const containerRef = useClickOutside<HTMLUListElement>(() => setOpen(false))


    return (
        <div ref={containerRef} className="relative z-20">
            <Button onClick={toggle} variant='ghost' size='icon-sm'
                className={`${open ? 'to-primary/20 dark:to-primary/50' : ''}`}
            >
                <ChartNoAxesColumnIcon className='size-4' />

            </Button>

            {open && (
                <ul className='flex flex-col justify-start bg-linear-to-b from-background to-secondary/30 app-blur border-t border-border absolute top-full right-0 h-fit mt-1 rounded-3xl overflow-clip py-3 px-4'>
                    {stats.map(stat => (
                        <li key={stat.id} className='py-1'>

                            <Typography className='text-nowrap' variant='caption-xs'>
                                {stat.label}: {stat.value}
                            </Typography>


                        </li>
                    ))}


                </ul>
            )}
        </div>
    )
}