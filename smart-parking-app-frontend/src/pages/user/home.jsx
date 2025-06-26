import React from 'react'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Header from '../../layouts/header'
import Footer from '../../layouts/footer'

const Home = () => {
  return (
    <>
      <TopBar />
      <Navbar />
      <Header />
      
      {/* Advertisement section */}
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold text-gray-900">Looking for a Spot?</h2>
        <p className="mt-2 text-gray-900">Find and reserve your parking space easily with SmartSpot. Park now!</p>
        <button className="mt-4 bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition">
          Reserve a Spot
        </button>
      </div>

      {/* Embedded Google Map showing parking location */}
      <div className="mt-10 mb-10 w-full flex justify-center">
        <iframe
          title="Parking Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57902.0383468516!2d125.55185540820644!3d7.1128166455080555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96ddb5b2d8d0f%3A0x77ebfb10162cc050!2sNHA%20Buhangin%20Car%20Parking%20Area!5e1!3m2!1sen!2sph!4v1750404047568!5m2!1sen!2sph"
          width="80%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-md shadow-lg"
        ></iframe>
      </div>

      {/* Footer section */}
      <Footer />
    </>
  )
}

export default Home