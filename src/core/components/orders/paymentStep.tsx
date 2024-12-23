'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCheckout } from '@/core/providers/checkoutProviver'
import { Apple, Banknote, CreditCard } from 'lucide-react'
import { GoogleIcon } from '@/components/ui/icons'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '@/app/actions/orders'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/core/providers/cartProvider'


const paymentMethods = [
  // { id: 'tabby', name: 'Tabby', icon: null },
  // { id: 'tamara', name: 'Tamara', icon: null },
  { id: 'cod', name: 'COD', icon: Banknote },
  { id: 'card', name: 'Card', icon: CreditCard },
  { id: 'apple-pay', name: 'Pay', icon: Apple },
  { id: 'google-pay', name: 'Pay', icon: GoogleIcon },
]


export const PaymentStep: React.FC = () => {
  const { isLoggedIn, orderData, updateOrderData } = useCheckout()
  const {clearCart} = useCart()
  const [paymentMethod, setPaymentMethod] = useState(orderData?.paymentId === 'cod' ? orderData?.paymentId : 'cod')
  const [couponCode, setCouponCode] = useState('')
  const { data } = useSession()
  const {toast} = useToast()

  const orderMutation = useMutation({
    mutationFn:  () => createOrder({
        ...orderData,
        // paymentMethod: paymentMethod,
        // couponCode: couponCode,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.accessToken?.token}`
        }
      }),
      onError(err){
        toast({
          title: "Error",
          description: err?.message ?? "An error occurred. Please try again.",
          variant: "destructive",
        })
      },
      onSuccess(data, variables, context) {
        if (data.error) {
          toast({
            title: "Error",
            description: data.error?.message,
            variant: "destructive",
          })
        }else{
          toast({
            title: "Success",
            description: "Order created successfully.",
            variant: "default",
          })
          }
        
      },
  })

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
    updateOrderData({ paymentId: value })
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate the coupon code with your backend
    console.log('Coupon submitted:', couponCode)
  }

  const handleConfirmOrder = async () => {
    // Here you would typically submit the order to your backend
    try {
      await orderMutation.mutateAsync()
      await clearCart()
    } catch (err) {
      console.log(err, 'order creation error')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Select your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all ${
                  paymentMethod === method.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handlePaymentMethodChange(method.id)}
              >
                <CardContent className="flex items-center justify- gap-3 p-4">
                  {method?.icon && <method.icon className="w-5 h-5" />}
                  <span className="text-sm font-medium">{method.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </CardContent>
      </Card>

      {isLoggedIn && (
        <Card>
          <CardHeader>
            <CardTitle>Coupon Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCouponSubmit} className="flex space-x-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
              />
              <Button type="submit">Apply</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleConfirmOrder} className="w-full">
        Confirm Order
      </Button>
    </div>
  )
}

