import { ChartNoAxesColumnIcon } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../../ui/Button";
import { Typography } from "../../../common/Typography";
import { useNotesAndChecklists } from "../hooks/useNotesAndChecklists";
import Popup from "@/components/ui/Popup";

export default function NotesStatsPopup() {
    const { notesCount, itemsCount, checkedItemsCount } = useNotesAndChecklists();

    // Calculate progress percentage
    const progress = itemsCount > 0 ? (checkedItemsCount / itemsCount) * 100 : 0;
    const remaining = itemsCount - checkedItemsCount;

    return (
        <Popup
            trigger={(props, state) => (
                <Button
                    {...props}
                    variant={state.open ? "primary-active" : "ghost"}
                    size="icon-sm"
                >
                    <ChartNoAxesColumnIcon className="size-4" />
                </Button>
            )}
            className="py-3 px-4 min-w-[160px]"
        >
            <div className="flex flex-col gap-y-3">
                <Typography variant="caption" weight="medium" className="border-b border-border pb-1">
                    Stats
                </Typography>

                <ul className="flex flex-col gap-y-1">
                    <li>
                        <Typography variant="caption-xs">
                            Notes: <span className="font-semibold">{notesCount}</span>
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="caption-xs">
                            Tasks: <span className="font-semibold">{itemsCount}</span>
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="caption-xs">
                            Checked: <span className="font-semibold">{checkedItemsCount}</span>
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="caption-xs">
                            Remaining: <span className="font-semibold">{remaining}</span>
                        </Typography>
                    </li>
                </ul>

                {/* Progress Bar Section */}
                {itemsCount > 0 && (
                    <div className="pt-2 mt-1 border-t border-border">
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
                    </div>
                )}
            </div>
        </Popup>
    );
}