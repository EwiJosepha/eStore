import { useState, useEffect } from 'react';
import { loadStripe, PaymentIntent, Stripe, StripeElements } from '@stripe/stripe-js';
import { CreateOrderDTO } from '@/types/orders';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export function useStripePayment() {
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

    useEffect(() => {
        // const paymentIntentId = localStorage.getItem('paymentIntentId')
        if (!stripe) {
            stripePromise.then(setStripe);
        }

    }, []);


    const createPaymentIntent = async (order: CreateOrderDTO) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...order, currency: 'aed' })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setPaymentIntent(data)
            return data;
        } catch (err) {
            setError((err as Error).message);
            throw err
        } finally {
            setProcessing(false);
        }
    };

    const confirmCardPayment = async (order: CreateOrderDTO & { orderId: string }, elements: StripeElements | null,) => {
        try {
            if (!stripe) {
                throw new Error('Invalid stripe')
            }

            const paymentIntent = await createPaymentIntent(order)

            const res = await stripe.confirmPayment({
                elements: elements!,
                clientSecret: paymentIntent.client_secret || paymentIntent?.client_secret,
                confirmParams: {
                    return_url: 'https://6k24021d-3001.inc1.devtunnels.ms' + "/order-confirmed",
                    receipt_email: order?.email
                },
            });

            if (res.error) {
                throw res.error
            }

            return paymentIntent

        } catch (err) {
            console.error(err)
            setError((err as Error)?.message || 'Something went wrong')
            throw err
        }
    }

    return {
        stripe,
        error,
        processing,
        paymentIntent,
        confirmCardPayment
    };
}

