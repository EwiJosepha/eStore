import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Cart } from '@/types/cart';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/app/actions/products';
import { Product } from '@/types/products';
import { DiscountType, FileType } from '@/types';
import envConf from '@/lib/env.conf';
import { useCart } from '../providers/cartProvider';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash, X } from 'lucide-react'
interface CartItemProps {
 readonly item: Cart
 readonly product?: Product
  // price: number
  // quantity: number
  // image: string
 readonly onRemove: (id: string) => void
 readonly onUpdateQuantity: (id: string, newQuantity: number) => void
}

export function CartItem({ item, product, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleIncrease = () => onUpdateQuantity(item?.id, item?.quantity + 1)
  const handleDecrease = () => onUpdateQuantity(item?.id, Math.max(1, item?.quantity - 1))

  const image = useMemo(()=>product?.media?.find(img => img?.type === FileType.IMAGE)?.url || '', [product?.media])

  const [productImage, setProductImage] = useState('/placeholder.svg')

  const discountedPrice = (product?.originalPrice || 0) - (product?.discounts?.map(item => item?.discountType === DiscountType.FIXED_AMOUNT ? +item?.discountValue : +product?.originalPrice * (+item?.discountValue / 100)).reduce((a, b)=> a+b,0)??0)

  useEffect(()=>{
    image && setProductImage(`${envConf.apiBaseUrl}/users-service/files?url=${image}`)
  },[image])

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center p-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image
            src={`${envConf.apiBaseUrl}/users-service/files?url=${productImage}`}
            alt={product?.name||'unknow product'}
            sizes='100vh'
            width={0}
            height={0}
            className='w-full h-full object-cover'
            onError={() => setProductImage('/placeholder.svg')}
          />
        </div>
        <div className="ml-4 flex flex-1 flex-col">
          <div className="text-base font-medium text-gray-900">
            <Link href={`/all-products/${product?.slug}`}>
              <h3 className='capitalize line-clamp-2 text-ellipsis'>{product?.name}</h3>
            </Link>
            <p>{product?.currency||'AED'}{discountedPrice}
              { discountedPrice !== product?.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">{product?.currency??'AED'}{product?.originalPrice}</span>
            )}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={handleDecrease}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2 w-8 text-center">{item?.quantity}</span>
              <Button variant="outline" size="icon" onClick={handleIncrease}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
          </div>
        </div>
      </CardContent>
      <div className="flex relative">
          <Button variant="ghost" className='w-max p-0 h-auto text-red-500 absolute right-2 bottom-2' onClick={() => onRemove(item?.id)} title='remove'>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
    </Card>
  )
}

// Define props for the CartSheet component
interface CartSheetProps {
  // cartItems: Cart[];
}

const ShoppingCartData: React.FC<CartSheetProps> = ({}) => {
  const {cart:cartItems, removeFromCart, updateCart, clearCart} = useCart()

  const {data} = useQuery({
    queryKey: ['cart-products'],
    queryFn: ()=>getProducts({
      params:{
        filter: {
          id: cartItems?.map(item => item.productId)
        }
      }
    }),
    enabled: cartItems && cartItems?.length > 0 ? true : false
  })

  const products = data?.data?.data ?? []

  return (
    <Suspense fallback={<div>Loading....</div>}>
      <>
        {
          cartItems?.length ? 
            <div className='border p-1 cursor-pointer flex ml-auto mb-2 text-xs w-max' onClick={clearCart}><Trash className='mr-2 w-4 h-4 text-red-500 inline'/>  <span>Empty Card</span></div> : null
            
        }
        {
          cartItems?.map((item) => (
            <CartItem
              key={item.id}
              item={item}

              onUpdateQuantity={async(id, qty) => await updateCart({productId: item.productId, quantity: qty, id})}
              onRemove={(id) => removeFromCart(id)}
              product={products?.find(pdt => pdt?.id === item?.productId)}
            />
          ))
        }

        {
          !cartItems?.length && <>
          <p className='text-sm text-center'>Your cart is empty</p>
          </>
        }

        {
          cartItems?.length ? <Link
          href={'/checkout'}
          className="rounded-sm m-2 flex justify-center"
        >
          <Button
            className="w-full bg-black text-white py-2 rounded-3xl shadow-3xl  mt-6"
          >
            Checkout
          </Button>
        </Link> : <Link
          href={'/all-products'}
          className="rounded-sm m-2 flex justify-center"
        >
          <Button
            className="w-full bg-black text-white py-2 rounded-3xl shadow-3xl  mt-6"
          >
            Start Shopping Now
          </Button>
        </Link>
        }
      </>
    </Suspense>
);

};

export default ShoppingCartData;