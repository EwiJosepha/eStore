'use client'

import { getProducts } from '@/app/actions/products'
import { Input } from '@/components/ui/input'
import { productStatusKeys } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import ProductsGrid from './products-grid'
import { Product } from '@/types/products'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    isFetching,
    error,
    isError
  } = useInfiniteQuery({
    queryKey: ['products', currentPage],
    queryFn: ({pageParam = 1})=>getProducts({params:{
        filter: {
            status: productStatusKeys.ACTIVE
        },
        options: {
            limit: 10,
            page: pageParam,
            withBrand: true,
            withCategories: true,
            withDiscounts: true
        }
    }}),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.limit || !lastPage?.data?.total || !lastPage?.data?.page) {
        return undefined
      }

      const { page, limit, total } = lastPage?.data
      const totalPages = Math.ceil(total / limit)
      return page < totalPages ? page + 1 : undefined
    },
    // initialData:{
    //   pages: [],
    //   pageParams: []
    // },
    initialPageParam:{},
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    placeholderData:(prev)=>prev
  })

  if (isLoading || isFetching) return <div>Fix this: Loading...</div>

  if (isError) return <div>Fix this: {error?.message}</div>

  const products = data?.pages?.flatMap(item => item?.data?.data).filter((pdt):pdt is Product => pdt != undefined) ?? []

  const handleLoadMore = async()=>{
    try {
      if (hasNextPage) {
        await fetchNextPage()
      }
    } catch (error) {
      console.log(error)
    }
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

      {
        hasNextPage && (
          <div className=' flex items-center py-10 justify-center'>
            <Button size={'lg'} className='cursor-pointer' onClick={handleLoadMore} disabled={isFetchingNextPage}>
              Load More
            </Button>
          </div>
        )
      }

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
