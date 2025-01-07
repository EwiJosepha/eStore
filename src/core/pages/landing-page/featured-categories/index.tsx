'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
const data = [
  { name: 'Electronics', image: '/placeholder.svg?height=200&width=200', productCount: 1000, description: "Electronic Products you need..." },
  { name: 'Clothing', image: '/placeholder.svg?height=200&width=200', productCount: 900, description: "Clothing Products you need..." },
  { name: 'Home & Garden', image: '/placeholder.svg?height=200&width=200', productCount: 9900, description: "Home & Garden" },
  { name: 'Sports', image: '/placeholder.svg?height=200&width=200', productCount: 5700, description: "Sports Products you need..." },
]
interface Category {
  name: string
  image: string
  productCount: number
  description: string
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))

        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return <FeaturedCategoriesSkeleton />
  }

  return (
    <div>
      <h2 className="text-2xl  font-bold text-center my-6">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link href={`/category/${category.name}`}>
            <Card className="group overflow-hidden border-2 hover:border-primary transition-colors duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-square">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex flex-col items-center justify-end p-4 text-center">
                    <Badge variant="secondary" className="mb-2">
                      {category.productCount} Products
                    </Badge>
                    <h3 className="text-white text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-3 line-clamp-2">{category.description}</p>
                    <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-white text-sm font-medium">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function FeaturedCategoriesSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-64 my-6 mx-auto" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg aspect-square">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

