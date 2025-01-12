'use client'

import envConf from '@/lib/env.conf'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
    fallbackSrc?: string
}

export const ImageWithFallback = ({
    src,
    alt,
    fallbackSrc = '/placeholder.svg?height=100&width=100',
    ...props
}: ImageWithFallbackProps) => {
    const [error, setError] = useState(false)

    return (
        <Image
            {...props}
            src={error ? fallbackSrc : `${envConf.apiBaseUrl}/users-service/files?url=${src}`}
            alt={alt}
            onError={() => setError(true)}
        />
    )
}