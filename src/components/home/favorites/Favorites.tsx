import Favicon from '@/components/common/Favicon';
import { ItemTooltip } from '@/components/common/ItemTooltip';
import { useFavorites } from '@/components/settings/components/tabs-details/sites-and-folders/components/favorites/hooks/useFavorites';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function Favorites() {
    const { data: sites } = useFavorites();

    if (sites.length === 0) return null;

    return (
        <>
            {sites.slice(0, 15).map((site) => (
                <ItemTooltip key={site.id || site.url} title={site.title} subtitle={site.url}>
                    <Link to={site.url}>
                        <Button
                            variant="primary"
                            className="size-10 md:size-14 w-auto min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square group z-30 px-0 rounded-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="transition-transform duration-200 group-hover:rotate-12">
                                <Favicon className="min-w-4 md:min-w-8 size-4 md:size-8" url={site.url} />
                            </div>
                        </Button>
                    </Link>
                </ItemTooltip>
            ))}
        </>
    );
}