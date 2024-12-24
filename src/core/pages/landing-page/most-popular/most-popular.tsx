'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/app/actions/products';
import { productStatusKeys } from '@/types';
import ProductsGrid from '../../products/products-grid';
import ProductCardSkeleton from '@/core/components/product-card-skeleton';
import LoadMore from '../load-more';
import ErrorAlert from '@/core/components/error-alert';
import NoResult from '@/core/components/no-results';

const MostPopular: React.FC = () => {
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

  if (error || isError || !data?.success) {
    return <ErrorAlert error={error || data?.error} message="An Error Occurred. Please try again later" />
  }

  const products = data?.data?.data ?? []

  if (!products?.length) {
    return <NoResult title={"No Products Found"} message="We couldn't find any products matching your criteria." />
  }
  return (
    <React.Fragment>
      <ProductsGrid products={products} />
      <LoadMore text='View All' />
    </React.Fragment>
  )
}

export default MostPopular
