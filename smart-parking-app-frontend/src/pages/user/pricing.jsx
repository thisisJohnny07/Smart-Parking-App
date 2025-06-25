import React, { useEffect, useState } from 'react'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import { getLocations } from '../../services/locationService'

const Pricing = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLocations()
        setLocations(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch pricing')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-10 w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Parking Slot Pricing
        </h1>
        <p className="text-center text-gray-500 text-lg mb-10">
          Choose the right slot based on your vehicle and comfort.
        </p>

        {loading && <p className="text-center text-gray-500">Loading pricing...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

        {!loading &&
          !error &&
          locations.map((loc) => (
            <div key={loc.id} className="mb-14">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{loc.name}</h2>
              <p className="text-gray-500 mb-6">{loc.address}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loc.slot_pricings.map((pricing, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{pricing.slot_type}</h3>
                    <p className="text-sm text-gray-500 mb-3">{pricing.slot_description}</p>

                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Vehicle:</strong> {pricing.vehicle_type}
                    </p>

                    <div className="text-2xl font-semibold text-grap-900 mt-3 tracking-wide">
                      ₱{parseFloat(pricing.rate_per_hour).toFixed(2)}
                      <span className="text-sm font-normal text-gray-500 ml-1">/ hour</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>

      <Footer />
    </div>
  )
}

export default Pricing