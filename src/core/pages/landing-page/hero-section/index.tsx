'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { getBanners } from '@/app/actions/banners'
import { FileType } from '@/types'
import Link from 'next/link'
import { ImageWithFallback } from '@/components/ui/image'

interface Banner {
  appLink: string | null
  createdAt: string
  createdBy: string
  deletedAt: string | null
  fileType: FileType.IMAGE | FileType.VIDEO
  id: string
  imageUrl: string
  isActive: boolean
  isDeleted: boolean
  lastModifiedBy: string | null
  lastUpdatedAt: string
  query: object
  webLink: string
  title?: string
  subtitle?: string
}

export default function HeroSection() {

  const { data, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => getBanners({
      params: {
        options: {
          limit: 5,
          page: 1,
        }
      }
    }),
  })

  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState<Banner[]>([])


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    if (!data?.data?.data.length) return
    if (data.data.data.length > 0)
      setBanners(data.data.data)
  }, [data?.data?.data?.length])

  useEffect(() => {
    if (!banners.length) return
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
              <ImageWithFallback
                src={banner.imageUrl}
                alt={banner.imageUrl}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h2 className="text-4xl font-bold mb-2">{banner.title ?? "Add Banner Title"}</h2>
                <p className="text-xl mb-4">{banner.subtitle ?? "add banner subtitle"}</p>
                <Button asChild>
                  <Link href={banner.webLink}>Add Banner Action <ArrowRight /></Link>
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

