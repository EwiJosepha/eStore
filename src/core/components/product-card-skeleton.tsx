import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden shadow-md flex flex-col">
            <div className="aspect-square relative overflow-hidden h-[200px]">
                <Skeleton className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
            </div>
            <CardContent className="p-4 flex-grow space-y-3">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-4/5 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800" />
                </div>
                <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800" />
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i + 1} className="h-4 w-4 bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                    <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-800" />
                        <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-800" />
                </div>
            </CardContent>
            <CardFooter className="p-4 grid grid-cols-2 gap-2">
                <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800" />
            </CardFooter>
        </Card>
    )
}

