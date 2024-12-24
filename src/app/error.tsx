'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

export default function error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <div className="min-h-[400px] grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-2 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription className="text-balance">
            {error.message || "An unexpected error occurred. Please try again later."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-sm text-muted-foreground">
            Error ID: <code className="font-mono">{error.digest}</code>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button
            onClick={() => reset()}
            aria-label="Try again"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            aria-label="Return home"
          >
            Return home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

