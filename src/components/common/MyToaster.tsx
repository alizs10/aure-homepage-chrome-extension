'use client';

import { createPortal } from 'react-dom';
import { Toaster } from 'sonner';

export default function MyToaster() {
    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <Toaster
            position="bottom-center"
            className="z-99999999"
        />,
        document.body,
    );
}