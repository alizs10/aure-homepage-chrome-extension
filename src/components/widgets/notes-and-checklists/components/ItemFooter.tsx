import { Typography } from '@/components/common/Typography';
import { formatDate } from 'date-fns';
import { useMemo } from 'react';

interface ItemFooterProps {
    date: number;
    edited?: boolean;
}

export default function ItemFooter({ date, edited }: ItemFooterProps) {

    const formattedDate = useMemo(() => {

        const dateObj = new Date(date);
        return formatDate(dateObj, "yyyy-MM-dd HH:mm");


    }, [date]);

    return (
        <Typography className='wrap-break-word text-muted-foreground ml-auto' variant='caption-xxs'>
            {edited && 'edited - '} {formattedDate}
        </Typography>
    )
}
