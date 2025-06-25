import React, { useEffect, useState } from 'react'
import TopBar from '../../layouts/topbar'
import Navbar from '../../layouts/navbar'
import Footer from '../../layouts/footer'
import { getLocations } from '../../services/locationService'

const Location = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations()
        setLocations(data)
      } catch (err) {
        setError(err.message || 'Failed to load locations')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Helper: extract unique vehicle types from slot_pricings for a location
  const getVehicleTypes = (location) => {
    if (!location.slot_pricings) return []
    const vehicles = location.slot_pricings.map(sp => sp.vehicle_type)
    // get unique vehicle types
    return [...new Set(vehicles)]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-10 w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Parking Locations
        </h1>

        {loading && (
          <p className="text-center text-gray-500 text-lg">Loading locations...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => {
              const vehicleTypes = getVehicleTypes(loc)

              return (
                <div
                  key={loc.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{loc.name}</h2>
                  <p className="text-gray-600 mb-4">{loc.address}</p>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Available Vehicles:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {vehicleTypes.length > 0 ? (
                        vehicleTypes.map((v, idx) => <li key={idx}>{v}</li>)
                      ) : (
                        <li>No vehicles available</li>
                      )}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Location