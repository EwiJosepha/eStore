import { Button } from '@/components/ui/button'
import { PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
interface NoResultProps {
    readonly message?: string
    readonly title?: string
}
const NoResult = ({ message, title }: NoResultProps) => {
    const router = useRouter()
    return (
        <React.Fragment>
            <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <PackageSearch className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold">{title ?? "No Results Found"}</h3>
                <p className="text-muted-foreground mt-2">
                    {message ?? "We couldn't find any resources matching your criteria."}
                </p>
            </div>
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

export default NoResult