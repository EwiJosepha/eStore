'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCheckout } from '@/core/providers/checkoutProviver'

export const OrderSummary: React.FC = () => {
  const { orderData } = useCheckout()

  const subtotal = orderData.orderItems?.reduce((sum, item) => sum + item.total, 0) || 0
  const tax = orderData.orderItems?.reduce((sum, item) => sum + item.tax, 0) || 0
  const total = subtotal + tax - (orderData.discount || 0)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[200px] rounded-md border p-4">
          {orderData.orderItems?.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium capitalize">{item.productName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p>{orderData?.currency || 'AED'}{item.total.toFixed(2)}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{orderData?.currency || 'AED'}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{orderData?.currency || 'AED'}{tax?.toFixed(2)}</span>
          </div>
          
          {orderData.discount && orderData.discount > 0 ? (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{orderData?.currency || 'AED'}{orderData.discount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{orderData?.currency || 'AED'}{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

