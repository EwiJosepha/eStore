'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckoutProvider } from '@/core/providers/checkoutProviver'
import { PersonalInfoStep } from '@/core/components/orders/personalInfoStep'
import { PaymentStep } from '@/core/components/orders/paymentStep'
import { OrderSummary } from '@/core/components/orders/orderSummary'
import { Product } from '@/types/products'

export const Checkout: React.FC<{product?: Product|null}> = ({product=null}) => {
  const [step, setStep] = React.useState<'personal-info' | 'payment'>('personal-info')

  return (
    <CheckoutProvider product={product}>
      <div className="container mx-auto p-4 xl:max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:basis-1/2 lg:basis-2/3">
            <Tabs defaultValue={step} value={step} className="w-full" onValueChange={(value)=>setStep(value as 'personal-info' | 'payment')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="personal-info">
                <PersonalInfoStep handleNext={()=>setStep('payment')} />
              </TabsContent>
              <TabsContent value="payment">
                <PaymentStep />
              </TabsContent>
            </Tabs>
          </div>
          <div className='md:basis-1/2 lg:basis-1/3'>
            <OrderSummary />
          </div>
        </div>
      </div>
    </CheckoutProvider>
  )
}

