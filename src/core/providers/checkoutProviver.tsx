'use client'

import React, { createContext, useContext, useState } from 'react'
import { CreateOrderDTO, ShippingAddress, OrderStatus } from '@/types/orders'
import { useSession } from 'next-auth/react'
import { useCart } from './cartProvider'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/app/actions/products'
import { Product } from '@/types/products'

type CheckoutContextType = {
  orderData: CreateOrderDTO
  updateOrderData: (data: Partial<CreateOrderDTO>) => void
  isLoggedIn: boolean
  setIsguest: (value: boolean) => void,
  isguest: boolean
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider: React.FC<{ children: React.ReactNode, product?: Product|null }> = ({ children, product = null }) => {
  const [isguest, setIsguest] = useState<boolean>(false)
  const {status, data} = useSession()
  const {cart} = useCart()

  const filter = {
    id: cart?.map(item => item?.productId)??[]
  }

  const {data: productData} = useQuery({
    queryKey: ['products', filter],
    queryFn: () => getProducts({
      headers:{
        Authorization: `Bearer ${data?.accessToken?.token}`
      },
      params:{
        filter
      }
    } ),
    enabled: !!filter?.id?.length,
  })

  const [orderData, setOrderData] = useState<CreateOrderDTO>({
    email: data?.user?.email ?? '',
    name: data?.user?.name ?? '',
    phone: data?.user?.phone ?? '',
    paymentId: 'fiat',
    currency: 'AED',
    shippingAddress: {} as ShippingAddress,
    discount: 0,
    // paymentMethod: '',
    orderItems: product ? [...(productData?.data?.data??[]).concat([product]).map(pdt =>{
      const found = cart?.find(item => item?.productId === pdt.id)
      return {
        productId: pdt.id,
        productName: pdt?.name,
        productSKU: pdt?.slug,
        quantity: found?.quantity || 1,
        price: pdt?.originalPrice,
        total: (found?.quantity||1) * pdt?.originalPrice,
        tax: 0
      }
    })] : [...(productData?.data?.data??[]).map(pdt =>{
      const found = cart?.find(item => item?.productId === pdt.id)
      return {
        productId: pdt.id,
        productName: pdt?.name,
        productSKU: pdt?.slug,
        quantity: found?.quantity || 1,
        price: pdt?.originalPrice,
        total: (found?.quantity||1) * pdt?.originalPrice,
        tax: 0
      }
    })],
    totalAmount: (product ? [...(productData?.data?.data??[]).concat([product]).map(pdt =>{
      const found = cart?.find(item => item?.productId === pdt.id)
      return {
        productId: pdt.id,
        productName: pdt?.name,
        productSKU: pdt?.slug,
        quantity: found?.quantity || 1,
        price: pdt?.originalPrice,
        total: (found?.quantity||1) * pdt?.originalPrice,
        tax: 0
      }
    })].reduce((a, b)=> a + b.total, 0) : [...(productData?.data?.data??[]).map(pdt =>{
      const found = cart?.find(item => item?.productId === pdt.id)
      return {
        productId: pdt.id,
        productName: pdt?.name,
        productSKU: pdt?.slug,
        quantity: found?.quantity || 1,
        price: pdt?.originalPrice,
        total: (found?.quantity||1) * pdt?.originalPrice,
        tax: 0
      }
    })].reduce((a, b)=> a + b.total, 0)),
    userId: data?.user?.id ?? '',
    status: OrderStatus.PENDING,
  })

  const updateOrderData = (data: Partial<CreateOrderDTO>) => {
    setOrderData(prevData => ({ ...prevData, ...data }))
  }

  return (
      <CheckoutContext.Provider value={{ orderData, updateOrderData, isLoggedIn: status === 'authenticated', isguest, setIsguest }}>
        {children}
      </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}

