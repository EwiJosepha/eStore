import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, CreditCard } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from '@/types/products'
import { DiscountType, FileType } from '@/types'
import envConf from '@/lib/env.conf'
import { useCart } from '../providers/cartProvider'
import { AxiosError } from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ImageWithFallback } from '@/components/ui/image'

interface ProductCardProps {
  readonly product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()

     const generateCallbackUrl = () => {
        const searchString = searchParams.toString();
        return `${path}${searchString?.length ? `?${searchString}` : ''}`;
    };

    const callbackUrl = generateCallbackUrl()

  const {addToCart} = useCart()

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
  }
  
  const discountedPrice = product?.originalPrice - (product?.discounts?.map(item => item?.discountType === DiscountType.FIXED_AMOUNT ? +item?.discountValue : +product?.originalPrice * (+item?.discountValue / 100)).reduce((a, b)=> a+b,0)??0)

  const productImage = product.media?.find(item => item?.type === FileType.IMAGE)?.url

  const handleAddToCart = async(id: string) => {
    try {
      await addToCart(id)
    } catch (err) {
      console.log(err, 'error from card adding')
      if (err instanceof AxiosError && err?.status === 401) {
        router.push(`/sign-in${callbackUrl?.length ? `?callback_url=${callbackUrl}`: ''}`)
      }
    }
  }

  return (
      <Card className="overflow-hidden flex flex-col">
        <Link href={`/all-products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden">
            <ImageWithFallback
              src={productImage!}
              alt={product.name}
              width={0}
              height={0}
              sizes='100vh'
              className="w-full h-full transition-transform duration-300 ease-in-out hover:scale-105 object-cover"
            />
          </div>
        </Link>
        <CardContent className="p-4 flex-grow">
          <Link href={`/all-products/${product.slug}`} className="block">
            <h3 className="text-sm md:text-base lg:text-lg font-semibold line-clamp-2 hover:underline capitalize" title={product.name}>
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-2">{product?.brand?.name}</p>
          <div className="flex items-center mb-2">
            <div className="flex mr-1">
              {renderStars(product.averageRating?? 0)}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1">
            <div>
              <span className="text-sm md:text-base lg:text-lg font-bold">{product?.currency??'AED'}{discountedPrice || product.originalPrice}</span>
              { discountedPrice !== product?.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">{product?.currency??'AED'}{product.originalPrice}</span>
              )}
            </div>
            <Badge variant={product.qtyInStock > 0 ? "success" : "destructive"} className='w-max !text-xs md:text-sm'>
              {product.qtyInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handleAddToCart(product.id)}
            disabled={product.qtyInStock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> <span className='hidden xs:inline text-xs md:text-sm lg:text-lg'>Add to Cart</span>
          </Button>
          <Button 
            className="w-full"
            disabled={product.qtyInStock <= 0}
          >
            <Link href={`/checkout?product=${product?.slug}`} className='w-full flex items-center'>
              <CreditCard className="mr-2 h-4 w-4" /> <span className='hidden xs:inline text-xs md:text-sm lg:text-lg'>Buy Now</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
  )
}