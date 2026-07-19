import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type PropsWithChildren } from 'react'
import { ThemeProvider } from './providers/ThemeProvider'
import Layout from './layouts/Layout'

// Create a client
const queryClient = new QueryClient()

export default function Wrappers({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>


            <ThemeProvider>

                <Layout>
                    {children}
                </Layout>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
