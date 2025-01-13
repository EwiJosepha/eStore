import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia'
});

export async function POST(req: NextApiRequest) {
    try {
        // Read the stream
        const text = await new Response(req.body).text();
        // Parse the JSON
        const body = JSON.parse(text);

        // Create a PaymentIntent with the specified amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: body?.totalAmount,
            currency: body?.currency,
            metadata: {
                data: JSON.stringify({
                    orderId: body?.orderId,
                    currency: body?.currency,
                    userId: body?.userId,
                    userEmail: body?.email,
                    userName: body?.name,
                    userPhone: body?.phone,
                    totalAmount: body?.totalAmount / 100,
                })
            }
        });

        return NextResponse.json(paymentIntent);
    } catch (error) {
        console.log(error, 'error')
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}