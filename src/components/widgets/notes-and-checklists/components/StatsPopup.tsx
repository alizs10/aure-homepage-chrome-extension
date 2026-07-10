import { ChartNoAxesColumnIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { motion } from "framer-motion" // 🌟 Added for smooth progress bar animation
import useClickOutside from "../../../../hooks/useOutsideClick"
import Button from "../../../common/Button"
import { Typography } from "../../../common/Typography"
import { useNotesAndChecklists } from "../hooks/useNotesAndChecklists"

export default function StatsPopup() {
    const { notesCount, itemsCount, checkedItemsCount } = useNotesAndChecklists()
    const [open, setOpen] = useState(false)

    // 🌟 Calculate progress percentage
    const progress = itemsCount > 0 ? (checkedItemsCount / itemsCount) * 100 : 0;

    const stats = useMemo(() => {
        return [
            { id: 1, label: "Notes", value: notesCount },
            { id: 2, label: "Items", value: itemsCount },
            { id: 3, label: "Checked", value: checkedItemsCount },
            { id: 4, label: "Remaining", value: itemsCount - checkedItemsCount },
        ];
    }, [notesCount, itemsCount, checkedItemsCount])

    function toggle() {
        setOpen(prev => !prev)
    }

    // 🌟 Fixed type from HTMLUListElement to HTMLDivElement to match the actual element
    const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false))

    return (
        <div ref={containerRef} className="relative z-20">
            <Button onClick={toggle} variant={open ? 'primary-active' : 'ghost'} size='icon-sm'>
                <ChartNoAxesColumnIcon className='size-4' />
            </Button>

            {open && (
                <ul className='flex flex-col justify-start app_container bg-background absolute top-full right-0 h-fit mt-1 rounded-3xl overflow-clip py-3 px-4 min-w-40'>

                    <Typography className='border-border' variant='caption' weight="medium">
                        Stats
                    </Typography>


                    {stats.map(stat => (
                        <li key={stat.id} className='py-1'>
                            <Typography className='text-nowrap' variant='caption-xs'>
                                {stat.label}: <span className="font-semibold">{stat.value}</span>
                            </Typography>
                        </li>
                    ))}

                    {/* 🌟 NEW: Progress Bar Section */}
                    {itemsCount > 0 && (

                        <li className="pt-3 mt-2 border-t border-border">
                            <div className="flex justify-between items-center mb-1.5">
                                <Typography variant="caption-xs" weight="medium">
                                    Completion
                                </Typography>
                                <Typography variant="caption-xs" className="text-primary font-bold">
                                    {Math.round(progress)}%
                                </Typography>
                            </div>

                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                        </li>
                    )}

                </ul>
            )}
        </div>
    )
}