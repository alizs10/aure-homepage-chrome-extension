import { ChartNoAxesColumnIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNotesAndChecklists } from "../hooks/useNotesAndChecklists";
import Popup from "@/components/ui/Popup";
import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";

export default function NotesStatsPopup() {
    const { notesCount, itemsCount, checkedItemsCount } = useNotesAndChecklists();

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
            className="py-3 px-4 min-w-40"
        >
            <div className="flex flex-col gap-y-3">
                <BetterTypography
                    variant="sm"
                    weight="medium"
                    className="border-b border-border pb-1"
                >
                    Stats
                </BetterTypography>

                <ul className="flex flex-col gap-y-1">
                    <li>
                        <BetterTypography variant="xs">
                            Notes: <span className="font-semibold">{notesCount}</span>
                        </BetterTypography>
                    </li>

                    <li>
                        <BetterTypography variant="xs">
                            Tasks: <span className="font-semibold">{itemsCount}</span>
                        </BetterTypography>
                    </li>

                    <li>
                        <BetterTypography variant="xs">
                            Checked: <span className="font-semibold">{checkedItemsCount}</span>
                        </BetterTypography>
                    </li>

                    <li>
                        <BetterTypography variant="xs">
                            Remaining: <span className="font-semibold">{remaining}</span>
                        </BetterTypography>
                    </li>
                </ul>

                {itemsCount > 0 && (
                    <div className="pt-2 mt-1 border-t border-border">
                        <div className="flex justify-between items-center mb-1.5">
                            <BetterTypography
                                variant="xs"
                                weight="medium"
                            >
                                Completion
                            </BetterTypography>

                            <BetterTypography
                                variant="xs"
                                className="text-primary font-bold"
                            >
                                {Math.round(progress)}%
                            </BetterTypography>
                        </div>

                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeOut",
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Popup>
    );
}