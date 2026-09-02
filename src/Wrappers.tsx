import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren } from 'react'
import { ThemeProvider } from './providers/ThemeProvider'

const queryClient = new QueryClient()

export default function Wrappers({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                {/* Layout is now handled by React Router in App.tsx */}
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    )
}