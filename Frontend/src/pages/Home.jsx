import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedServices from '../components/FeaturedServices'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <FeaturedServices />
      <Footer/>
    </div>
  )
}

export default Home
