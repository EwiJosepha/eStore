import { getOrderById } from "@/app/actions/orders";
import { auth } from "@/auth";
import { TrackOrderDetails } from "@/core/pages/orders/trackOrderDetails";
import { dehydrateQuery } from "@/lib/dehydrateQuery";
import { HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface TrackOrderPageProps {
  readonly params: { id: string }
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  const session = await auth()

  const dehydratedState = await dehydrateQuery({
    queryKey: ['order', params.id],
    queryFn: () => getOrderById(params.id, {
      headers: {
        Authorization: `Bearer ${session?.accessToken?.token}`
      }
    }),
  })
  if (!dehydratedState) return notFound()

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Track Order</h1>
        <TrackOrderDetails />
      </div>
    </HydrationBoundary>
  )
}

