import React, { useState, useEffect } from 'react'
import bgImage from '../assets/bg.jpg'
import { useNavigate } from 'react-router-dom'
import { fetchLocationsAndVehicles } from '../services/locationService'
import useAuth from '../hooks/useAuth'

const Header = () => {
  // State for user input
  const [vehicleType, setVehicleType] = useState(null)
  const [location, setLocation] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  // Store dropdown data for select inputs
  const [locations, setLocations] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])

  const { user } = useAuth()
  const navigate = useNavigate()

  // Set today's date on mount and fetch dropdown data
  useEffect(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    setDate(today)

    fetchLocationsAndVehicles().then((res) => {
      setLocations(res.locations || [])
      setVehicleTypes(res.vehicle_types || [])
    })
  }, [])

  // Compute if selected date is today
  const now = new Date()
  const todayDate = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().slice(0, 5)
  const isToday = date === todayDate

  // If date is today and time is in the past, clear it
  useEffect(() => {
    if (isToday && time && time <= currentTime) {
      setTime('')
    }
  }, [date]) // triggered when date changes

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // If no user or admin is trying to book, redirect to login
    if (!user || user.is_superuser) {
      navigate('/sign-in')
      return
    }

    // Navigate to booking page with form state
    navigate('/book-parking', {
      state: {
        locationId: location.id,
        locationLabel: location.label,
        vehicleTypeId: vehicleType.id,
        vehicleTypeLabel: vehicleType.label,
        date,
        time
      }
    })
  }

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat text-white min-h-[600px]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: 'rgba(17, 24, 39, 0.83)' }}
      />

      <div className="relative z-20 py-16 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Book a Parking Spot</h1>
        <p className="text-lg mb-10 text-gray-200">
          Reserve your space ahead of time and avoid the hassle.
        </p>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 md:p-10 text-white shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location Dropdown */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Select Location</label>
              <select
                value={location?.id || ''}
                onChange={(e) => {
                  const id = parseInt(e.target.value)
                  const selected = locations.find(l => l.id === id)
                  setLocation({ id, label: selected.address })
                }}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="" disabled>Select location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.address}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Type Dropdown */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Vehicle Type</label>
              <select
                value={vehicleType?.id || ''}
                onChange={(e) => {
                  const id = parseInt(e.target.value)
                  const selected = vehicleTypes.find(v => v.id === id)
                  setVehicleType({ id, label: selected.name })
                }}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="" disabled>Select vehicle</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Reservation Date */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Reservation Date</label>
              <input
                type="date"
                min={todayDate} // This restricts selecting past dates
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Reservation Time */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Reservation Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                min={isToday ? currentTime : undefined} // Disable past times if today
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-1/2 bg-gray-900 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
          >
            Reserve Spot
          </button>
        </form>
      </div>
    </div>
  )
}

export default Header