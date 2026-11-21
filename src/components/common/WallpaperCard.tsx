import { Trash2Icon } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from '@/stores/useToastStore';
import { isColor } from '@/features/wallpapers';
import { BetterTypography } from '@/components/common/BetterTypography';
import { ItemTooltip } from '@/components/common/ItemTooltip';

interface WallpaperCardProps {
    lightVariant?: string;
    darkVariant?: string;
    name: string;
    description?: string;
    showName?: boolean;
    isActive: boolean;
    onSelect: () => void;
    deletable?: boolean;
    onDelete?: () => void;
}

export default function WallpaperCard({
    lightVariant,
    darkVariant,
    name,
    description,
    showName = false,
    isActive,
    onSelect,
    deletable,
    onDelete,
}: WallpaperCardProps) {
    const isDarkColor = isColor(darkVariant);
    const isLightColor = isColor(lightVariant);

    const card = (
        <div
            onClick={() => onSelect()}
            className={`${isActive ? 'outline-primary' : 'outline-transparent hover:outline-primary'} outline-2 p-1 rounded-[28px]`}
        >
            <div className="relative group aspect-video rounded-3xl overflow-hidden cursor-pointer border border-border/40">
                <div
                    style={{
                        background: darkVariant
                            ? isDarkColor
                                ? darkVariant
                                : `url(${darkVariant})`
                            : 'none',
                        backgroundSize: isDarkColor ? undefined : "cover",
                        backgroundPosition: isDarkColor ? undefined : "center",
                        backgroundRepeat: isDarkColor ? undefined : "no-repeat",
                    }}
                    className="relative aspect-video bg-secondary/50"
                >
                    {lightVariant && (
                        isLightColor ? (
                            <div
                                style={{
                                    backgroundColor: lightVariant,
                                    ...(darkVariant ? {
                                        clipPath: "polygon(0 0, 0 0, 100% 100%, 0% 100%)"
                                    } : undefined),
                                }}
                                className="w-full h-full"
                            />
                        ) : (
                            <img
                                src={lightVariant}
                                alt={name}
                                className="w-full h-full object-cover"
                                style={darkVariant ? {
                                    clipPath: "polygon(0 0, 0 0, 100% 100%, 0% 100%)"
                                } : undefined}
                            />
                        )
                    )}
                </div>

                {showName && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-background/80 backdrop-blur-md border border-border/40 shadow-xs pointer-events-none">
                        <BetterTypography variant="xs" weight="medium" className="text-foreground leading-none">
                            {name}
                        </BetterTypography>
                    </div>
                )}

                {/* Delete button appears on hover ONLY for custom (non-default) wallpapers */}
                {deletable && (
                    <Button
                        size='icon-sm'
                        variant='destructive'
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            if (onDelete) {
                                onDelete();
                                toast.info("Wallpaper removed!");
                            }
                        }}
                        className="absolute top-3 left-3 p-1.5 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                )}
            </div>
        </div>
    );

    if (description) {
        return (
            <ItemTooltip title={name} subtitle={description}>
                {card}
            </ItemTooltip>
        );
    }

    return card;
}
