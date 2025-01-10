'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCheckout } from '@/core/providers/checkoutProviver'
import { Banknote, CreditCard, LoaderCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '@/app/actions/orders'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/core/providers/cartProvider'
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js'
import { useStripePayment } from '@/hooks/useStripe'
import { StripeElements } from '@stripe/stripe-js'
import { OrderStatus } from '@/types/orders'


const paymentMethods = [
  // { id: 'tabby', name: 'Tabby', icon: null },
  // { id: 'tamara', name: 'Tamara', icon: null },
  { id: 'cod', name: 'COD', icon: Banknote },
  { id: 'fiat', name: 'Fiat', icon: CreditCard },
]


export const PaymentStep: React.FC = () => {
  const {stripe, confirmCardPayment, error, processing} = useStripePayment()
  const { isLoggedIn, orderData, updateOrderData,  } = useCheckout()
  const {clearCart} = useCart()
  const [paymentMethod, setPaymentMethod] = useState(orderData?.paymentId === 'cod' ? orderData?.paymentId : 'fiat')
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { data } = useSession()
  const {toast} = useToast()

  const orderMutation = useMutation({
    mutationFn:  async(elements?: StripeElements|null) => {
      if (elements || paymentMethod === 'fiat') {
        const order = await createOrder({
          ...orderData,
          totalAmount: orderData.totalAmount,
          status: OrderStatus.PENDING,
          
          // paymentMethod: paymentMethod,
          // couponCode: couponCode,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.accessToken?.token}`
          }
        })

        if (!order.data || !order.success) {
          throw order?.error || new Error('Failed to create order')
        }

        return await confirmCardPayment({
          ...orderData,
          totalAmount: orderData.totalAmount  * 100,
          orderId: order?.data?.id
        }, elements||null)
      }
      return await createOrder({
        ...orderData,
        // paymentMethod: paymentMethod,
        // couponCode: couponCode,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.accessToken?.token}`
        }
      })
    },
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

  const handleConfirmOrder = async (elements?: StripeElements | null) => {
    // Here you would typically submit the order to your backend
    try {
      // if (elements && orderData.paymentId === 'fiat') {
        
      // }
      setLoading(true)
      await orderMutation.mutateAsync(elements)
      await clearCart()
    } catch (err) {
      console.log(err, 'order creation error')
    }finally{
      setLoading(false)
    }
  }

  if (!stripe) {
    return <div>Loading stripe...</div>
  }

  console.log(orderData)

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

      <Elements stripe={stripe} options={{
        mode: 'payment',
        amount: orderData.totalAmount * 100, //smallest unit of aed is 1fils and 100fils = 1AED
        currency: (orderData?.currency || 'aed').toLowerCase()
      }}>
        <Payment loading={loading || processing} handleConfirmOrder={handleConfirmOrder} paymentMethod={paymentMethod}  />
      </Elements>
    </div>
  )
}

const Payment = ({handleConfirmOrder, paymentMethod, loading}:{
  handleConfirmOrder: (e?:StripeElements | null)=>void
  loading: boolean
  paymentMethod: string
})=>{
  const elements = useElements()
  return (
    <>
      {
        paymentMethod === 'fiat' && (
          <>
          <PaymentElement />
          </>
        )
      }

      <Button disabled={loading} onClick={(e)=>{
        if (paymentMethod === 'fiat' && elements) {
          elements?.submit()
        }
        handleConfirmOrder(paymentMethod === 'fiat' ? elements : null)
      }} className="w-full">
        {loading && <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />} Confirm Order
      </Button>
    </>
  )
}