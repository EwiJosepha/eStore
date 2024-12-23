'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/app/actions/orders'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function OrdersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const session = useSession()

  const {data} = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: ()=>getOrders({
      headers:{
        Authorization: `Bearer ${session.data?.user?.accessToken?.token}`
      },
      params:{
        options:{
          page: currentPage
        }
      }
    }),
    enabled: !!session.data?.accessToken?.token,
    placeholderData(data){return data},
  })

  const orders = data?.data?.data ?? []

  const filteredOrders = orders

  const totalPages = Math.ceil((data?.data?.total||0) / (data?.data?.limit || 10))
  const indexOfLastOrder = currentPage * (data?.data?.limit || 10)
  const indexOfFirstOrder = indexOfLastOrder - (data?.data?.limit || 10)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/orders/track-order/${order?.id}`} className='text-blue-800 hover:underline'>{order.refNumber}</Link>
                </TableCell>
                <TableCell>{moment(new Date(order.createdAt)).format('MMM Do YYYY')}</TableCell>
                <TableCell>{order?.currency ?? 'AED'}{order.totalAmount}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
      </CardContent>
    </Card>
  )
}

