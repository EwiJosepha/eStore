import { ProductCard } from '@/core/components/product-card'
import { Product } from '@/types/products'

interface Props {
  readonly products: Product[]
}

export default function ProductsGrid({ products }: Props) {

  return (
    <div className="grid 2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

