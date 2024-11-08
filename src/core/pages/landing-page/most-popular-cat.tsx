import ProductCard from '@/core/components/product-card'
import React from 'react'
import { Product } from '@/core/components/grid-container'

interface ProductCardProps {
  products: Product[];
}

const MostPopularCategories: React.FC<ProductCardProps> = ({ products }) => {
  return (
    <>
      <p className="text-3xl text-center mb-4 mt-4">Most Popular</p>
    <div className='grid grid-cols-2 gap-4 px-2 lg:px-10  md:grid-cols-3 lg:grid-cols-4'>

      {products?.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          imageUrl={product.imageUrl}
          description={product.description}
          price={product.price}
          discount={product.discount}      />
      ))}

    </div>
    </>
  )
}

export default MostPopularCategories
