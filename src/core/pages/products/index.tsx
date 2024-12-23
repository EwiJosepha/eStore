'use client'
import { getProducts } from '@/app/actions/products'
import { Input } from '@/components/ui/input'
import { productStatusKeys } from '@/types'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import ProductsGrid from './products-grid'
import ProductCardSkeleton from '@/core/components/product-card-skeleton'
import ErrorAlert from '@/core/components/error-alert'
import NoResult from '@/core/components/no-results'

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const { data, error, isLoading, isFetching, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({
      params: {
        filter: {
          status: productStatusKeys.ACTIVE
        },
        options: {
          limit: 10,
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
    return <ErrorAlert />
  }

  const products = data?.data?.data ?? []

  if (!products?.length) {
    return <NoResult title='No Products Found' message="We couldn't find any products matching your criteria." />
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Input
          type="search"
          placeholder="Search products..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      <ProductsGrid products={products} />
      {/* <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  )
}
