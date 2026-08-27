import { Toaster } from 'sonner';

export default function MyToaster() {
    return (
        <Toaster
            position="bottom-center"
        // No toastOptions or inline styles needed anymore!
        />
    );
}