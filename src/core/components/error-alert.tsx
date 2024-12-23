'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ErrorAlertProps {
    readonly message?: string
    readonly error?: any
}
const ErrorAlert = ({ error, message }: ErrorAlertProps) => {
    const router = useRouter()
    return (
        <React.Fragment>
            <Alert variant="destructive" className="mx-auto max-w-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {message ?? error?.message ?? 'Failed to load resource. Please try again later.'}
                </AlertDescription>
            </Alert>
            <div className='flex items-center justify-center my-2'>
                <Button
                    onClick={() => router.refresh()}
                    aria-label="Refresh"
                >
                    Try Again
                </Button>
            </div>
        </React.Fragment>
    )
}

export default ErrorAlert