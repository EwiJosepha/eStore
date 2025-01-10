import { Checkout } from '@/core/pages/checkout'
import { Product } from '@/types/products'
import React, { Suspense } from 'react'
import { getProductBySlug } from '../actions/products'

export default async function CheckoutPage({searchParams}: {searchParams: Record<string, string | string[]>}) {
  const productSlug = searchParams?.product
  let product:Product | null = null

  if (productSlug) {
    const data = await getProductBySlug(productSlug as string)
    product = data?.data
  }

  return (
    <Suspense fallback='Loading...'>
        <Checkout product={product} />
    </Suspense>
  )
}
