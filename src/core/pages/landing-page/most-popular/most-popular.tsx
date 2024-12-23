'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/app/actions/products';
import { productStatusKeys } from '@/types';
import ProductsGrid from '../../products/products-grid';
import { AlertCircle, PackageSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProductCardSkeleton from '@/core/components/product-card-skeleton';
import LoadMore from '../load-more';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const MostPopular: React.FC = () => {
  const router=useRouter()
  const { data, error, isLoading, isFetching, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({
      params: {
        filter: {
          status: productStatusKeys.ACTIVE
        },
        options: {
          limit: 5,
          page: 1,
          withBrand: true,
          withCategories: true,
          withDiscounts: true
        }
      }
    }),
  })


  if (isLoading || isFetching) {
    return (
      <div className="grid sm:p-3  2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i + 1}`} />
        ))}
      </div>
    )
  }

  if (error || isError) {
    return (
      <React.Fragment>
        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to load products. Please try again later.'}
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

  const products = data?.data?.data ?? []

  if (!products?.length) {
    return (
      <React.Fragment>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <PackageSearch className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">No Products Found</h3>
          <p className="text-muted-foreground mt-2">
            We couldn't find any products matching your criteria.
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

  return (
    <React.Fragment>
      <ProductsGrid products={products} />
      <LoadMore text='View All' />
    </React.Fragment>
  )
}

export default MostPopular
