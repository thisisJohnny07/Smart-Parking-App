// React and hooks for state and navigation
import React, { useEffect, useState } from 'react'
import { getLocations, deleteLocation } from '../../services/locationService'
import { useNavigate } from 'react-router-dom'

const ManageParking = () => {
  // Initialize state for locations, loading, and error
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch all locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations() // API call to get all locations
        setLocations(data)
      } catch (err) {
        setError('Failed to load locations.')
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  // Navigate to Add Location page
  const handleAddLocation = () => navigate('/manage-parking/add')

  // Navigate to Edit Location page
  const handleEditLocation = (id) => navigate(`/manage-parking/edit/${id}`)

  // Confirm and delete selected location
  const handleDeleteLocation = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this location?')
    if (!confirm) return

    try {
      await deleteLocation(id) // API call to delete location
      setLocations((prev) => prev.filter((loc) => loc.id !== id)) // Remove from state
    } catch (error) {
      alert('Failed to delete the location. Please try again.')
    }
  }

  // Organize slot pricing by vehicle type for table display
  const groupByVehicleType = (slotPricings) => {
    return slotPricings.reduce((acc, slot) => {
      if (!acc[slot.vehicle_type]) acc[slot.vehicle_type] = []
      acc[slot.vehicle_type].push(slot)
      return acc
    }, {})
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Parking</h1>
        {/* Button to add a new location */}
        <button
          onClick={handleAddLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Location
        </button>
      </header>

      {/* Display loading, error, or location list */}
      {loading ? (
        <div className="text-center text-gray-600">Loading locations…</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : locations.length === 0 ? (
        <div className="text-center text-gray-500">No parking locations found.</div>
      ) : (
        // Loop through each location and render details
        <div className="bg-white rounded shadow overflow-x-auto w-full">
          {locations.map((loc) => {
            const grouped = groupByVehicleType(loc.slot_pricings) // Group slots by vehicle

            return (
              <div key={loc.id} className="mb-8 border-b last:border-b-0 border-gray-200">
                <div className="flex justify-between items-center py-4 px-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{loc.name}</h2>
                    <p className="text-sm text-gray-500">{loc.address}</p>
                  </div>
                  {/* Edit and Delete buttons for each location */}
                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => handleEditLocation(loc.id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Display grouped slot pricing in a table */}
                <table className="w-full border-t border-gray-200 text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-gray-700">Vehicle Type</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Slot Type</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Rate (₱/hr)</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Available Slots</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render slot rows under each vehicle type */}
                    {Object.entries(grouped).map(([vehicle, slots]) =>
                      slots.map((slot, idx) => (
                        <tr
                          key={slot.slot_type + idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          {/* Merge vehicle type cell */}
                          {idx === 0 && (
                            <td
                              rowSpan={slots.length}
                              className="px-6 py-3 align-top font-medium text-gray-900"
                            >
                              {vehicle}
                            </td>
                          )}
                          <td className="px-6 py-3">{slot.slot_type}</td>
                          <td className="px-6 py-3">₱{slot.rate_per_hour}</td>
                          <td className="px-6 py-3">{slot.available_slots}</td>
                          <td className="px-6 py-3 text-gray-600 italic">{slot.slot_description}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ManageParking