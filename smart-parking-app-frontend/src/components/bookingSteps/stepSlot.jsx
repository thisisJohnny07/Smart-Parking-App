import React, { useEffect, useState } from 'react'
import { checkSlotAvailability } from '../../services/reservationService'

const StepSlot = ({ selectedSlot, setSelectedSlot, locationId, vehicleTypeId, date, time }) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlots = async () => {
      if (!locationId || !vehicleTypeId || !date || !time) return

      setLoading(true)
      try {
        const results = await checkSlotAvailability({
          location_id: locationId,
          vehicle_type_id: vehicleTypeId,
          date,
          time
        })

        const mapped = results.map((slot, index) => ({
          id: index + 1,
          label: slot.slot_type,
          price: slot.rate_per_hour,
          available: slot.available_slots,
          type: slot.type,
          notes: slot.description
        }))

        setOptions(mapped)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch slot availability.')
        setOptions([])
      }
      setLoading(false)
    }

    fetchSlots()
  }, [locationId, vehicleTypeId, date, time])

  return (
    <div className="my-10 text-center">
      <h2 className="text-2xl font-semibold mb-6">📍 Step 2: Select a Parking Option</h2>

      {loading ? (
        <p className="text-gray-700">Loading slot options...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : options.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium">No slots available for your selection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {options.map((option) => {
            const isDisabled = option.available === 0
            return (
              <button
                key={option.id}
                onClick={() => !isDisabled && setSelectedSlot(option)}
                disabled={isDisabled}
                className={`rounded-xl border p-6 text-left transition-all text-gray-900 shadow-sm ${
                  selectedSlot?.id === option.id
                    ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-100'
                    : 'border-gray-300 hover:bg-gray-50'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <h3 className="text-lg font-bold mb-1">{option.label}</h3>
                <p className="text-sm text-gray-600">₱{option.price} per hour</p>
                <p className="text-sm text-gray-600">Available: {option.available}</p>
              </button>
            )
          })}
        </div>
      )}

      {selectedSlot && (
        <div className="mt-8 text-left max-w-xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold mb-2">Slot Details</h4>
          <p><strong>Type:</strong> {selectedSlot.type}</p>
          <p><strong>Description:</strong> {selectedSlot.notes}</p>
          <p><strong>Rate:</strong> ₱{selectedSlot.price} per hour</p>
        </div>
      )}
    </div>
  )
}

export default StepSlot