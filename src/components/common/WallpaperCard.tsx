import { Trash2Icon } from 'lucide-react';
import Button from './Button';
import { toast } from 'sonner';

interface WallpaperCardProps {
    lightVariant?: string;
    darkVariant?: string;
    name: string;
    isActive: boolean;
    onSelect: () => void;
    deletable?: boolean;
    onDelete?: () => void;
}

export default function WallpaperCard({ lightVariant, darkVariant, name, isActive, onSelect, deletable, onDelete }: WallpaperCardProps) {
    return (
        <div
            onClick={() => onSelect()}
            className={`${isActive ? 'outline-primary' : 'outline-transparent hover:outline-primary'} outline-2  p-1 rounded-[28px]`}
        >

            <div className="relative group aspect-video rounded-3xl overflow-hidden transition-all cursor-pointer">

                <div
                    style={{
                        // Safely handle undefined dark variant to prevent invalid CSS
                        background: darkVariant ? `url(${darkVariant})` : 'none',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                    className="relative aspect-video bg-secondary/50">

                    {/* Safely handle undefined light variant */}
                    {lightVariant && (
                        <img
                            src={lightVariant}
                            alt={name}
                            className="w-full h-full object-cover"
                            style={darkVariant ? {
                                clipPath: "polygon(0 0, 0 0, 100% 100%, 0% 100%)"
                            } : undefined}
                        />
                    )}
                </div>
                {/* Delete button appears on hover ONLY for custom (non-default) wallpapers */}
                {deletable && (
                    <Button
                        size='icon-sm'
                        variant='destructive'
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            // handleDelete(wp.id);
                            if (onDelete) {
                                onDelete();
                                toast.info("Wallpaper removed!")

                            }
                        }}
                        className="absolute top-3 left-3 p-1.5 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                )}
            </div>
        </div>
    )
}
