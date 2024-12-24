
import React from 'react'
import { HeroSection, MostPopularProducts} from "@/core/pages/landing-page/index"


const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <div className='px-4 py-10 md:px10'>
        <p className="text-2xl md:text-4xl text-center mb-4 font-bold font-sans pt-5">Most Popular Products</p>
        <MostPopularProducts />
      </div>
    </div>
  )
}

export default HomePage