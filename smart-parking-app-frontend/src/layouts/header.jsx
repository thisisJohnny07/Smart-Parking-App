import React, { useState } from 'react'
import bgImage from '../assets/bg.jpg'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [vehicleType, setVehicleType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const navigate = useNavigate()

  const availableLocations = [
    'NHA Buhangin',
    'Davao City Hall',
    'SM Lanang Parking',
    'Abreeza Mall Lot A',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/book-parking', {
      state: { location, vehicleType, date, time }
    })
  }

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat text-white min-h-[600px]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: 'rgba(17, 24, 39, 0.83)' }}
      />

      <div className="relative z-20 py-16 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Book a Parking Spot</h1>
        <p className="text-lg mb-10 text-gray-200">Reserve your space ahead of time and avoid the hassle.</p>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 md:p-10 text-white shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Select Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="" disabled>Select location</option>
                {availableLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Type */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="" disabled>Select vehicle</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="van">Van</option>
              </select>
            </div>

            {/* Date */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Reservation Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Time */}
            <div className="text-left">
              <label className="block mb-2 text-sm font-semibold">Reservation Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

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