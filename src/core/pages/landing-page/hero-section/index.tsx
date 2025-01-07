'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const data = [
  {
    id: 1,
    image: '/placeholder.svg?height=400&width=1200',
    alt: 'Summer Collection',
    title: 'Summer Collection',
    subtitle: 'Discover our latest arrivals',
    cta: 'Shop Now',
    link: '/summer-collection',
  },
  {
    id: 2,
    image: '/placeholder.svg?height=400&width=1200',
    alt: 'Special Offer',
    title: 'Special Offer',
    subtitle: 'Get 30% off on selected items',
    cta: 'View Offers',
    link: '/special-offers',
  },
  {
    id: 3,
    image: '/placeholder.svg?height=400&width=1200',
    alt: 'New Arrivals',
    title: 'New Arrivals',
    subtitle: 'Check out our latest products',
    cta: 'Explore',
    link: '/new-arrivals',
  },
]

interface Banner {
  id: number
  image: string
  alt: string
  title: string
  subtitle: string
  cta: string
  link: string
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setBanners(data)
      } catch (error) {
        alert("err")
        console.error('Error fetching banners:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(nextSlide, 5000)
      return () => clearInterval(timer)
    }
  }, [banners])

  if (isLoading) {
    return <HeroSectionSkeleton />
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <div className="relative h-[400px]">
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                <p className="text-xl mb-4">{banner.subtitle}</p>
                <Button asChild>
                  <a href={banner.link}>{banner.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  )
}

function HeroSectionSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="w-full">
        <div className="relative h-[400px]">
          <Skeleton className="h-full w-full" />
          <div className="absolute inset-0 bg-gray-400 bg-opacity-15 flex flex-col items-center justify-center p-4">
            <Skeleton className="h-10 w-3/4 max-w-[400px] mb-2" />
            <Skeleton className="h-6 w-2/3 max-w-[300px] mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full" />
      <Skeleton className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full" />
    </div>
  )
}

