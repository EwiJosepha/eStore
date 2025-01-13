'use client'

import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/app/actions/products'
import NoResult from '@/core/components/no-results'
import ErrorAlert from '@/core/components/error-alert'
import { ImageWithFallback } from '@/components/ui/image'

export default function FeaturedCategories() {

  const { data, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({
      params: {
        options: {
          limit: 5,
          page: 1,
        }
      }
    }),
  })

  if (isLoading) {
    return <FeaturedCategoriesSkeleton />
  }
  if (error?.message)
    return <ErrorAlert message="Error Getting Featured Categories" />
  if (!data?.data?.data.length)
    return <NoResult message='No Featured Categories' title='Featured Categories' />
  const categories = data.data.data
  return (
    <div>
      <h2 className="text-2xl  font-bold text-center my-6">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link href={`/all-products/?category=${category.name}`}>
            <Card className="group overflow-hidden border-2 hover:border-primary transition-colors duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-square">
                  <ImageWithFallback
                    src={category?.image!}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex flex-col items-center justify-end p-4 text-center">
                    <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{category.description}</p>
                    <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-white text-sm font-medium">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function FeaturedCategoriesSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-64 my-6 mx-auto" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg aspect-square">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

