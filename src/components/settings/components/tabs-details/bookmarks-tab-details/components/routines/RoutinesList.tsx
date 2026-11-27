import { useRoutines } from '@/features/bookmarks';
import EditRoutine from './EditRoutine';
import ManageRoutine from './ManageRoutine';
import { OrderableList } from '../../OrderableList';
import { BetterTypography } from '@/components/common/BetterTypography';

export default function RoutinesList() {
    const { data, removeItem, sortUp, sortDown } = useRoutines();

    return (
        <OrderableList
            items={data}
            onSortUp={sortUp}
            onSortDown={sortDown}
            onRemove={removeItem}
            removeToastMessage="Routine deleted!"
            emptyMessage="Add your first routine to launch multiple sites with one click"
            renderLeft={(routine, index) => (
                <BetterTypography variant="sm" weight="medium" className="line-clamp-1">
                    {index + 1}. {routine.title}
                    <span className="text-muted-foreground font-normal ml-1">
                        {` (${routine.websites?.length || 0}/5 websites)`}
                    </span>
                </BetterTypography>
            )}
            renderRight={(routine) => (
                <>
                    <ManageRoutine routine={routine} />
                    <EditRoutine routine={routine} />
                </>
            )}
        />
    );
}
