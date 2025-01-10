import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const buffer = async (req: NextApiRequest) => {
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature']!;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
        } catch (err) {
            console.error(`⚠️  Webhook signature verification failed.`, (err as Error).message);
            return NextResponse.json({ message: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent was successful!`, paymentIntent);
                // Handle the event
                // Here we need to now make request to create order in backend with order data
                break;
            case 'payment_intent.payment_failed':
                const paymentFailedIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent failed.`, paymentFailedIntent);
                // Handle the event
                break;
            default:
                console.warn(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        NextResponse.json({ message: 'Internal error' }, { status: 500 })
    }
};