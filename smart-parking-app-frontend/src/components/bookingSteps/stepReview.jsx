import React from 'react'

const pricingOptions = [
  { id: 1, label: 'Standard Slot', price: 40, type: 'Open Space', notes: 'Ideal for sedans and hatchbacks.' },
  { id: 2, label: 'Covered Slot', price: 60, type: 'Covered', notes: 'Best for rainy weather and sun protection.' },
  { id: 3, label: 'Premium Slot', price: 80, type: 'Near Entrance', notes: 'Closest to exits and facilities.' },
]

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-4 py-3 border rounded-md shadow-sm">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-900 mt-1 sm:mt-0">{value}</span>
  </div>
)

const StepReview = ({
  location,
  vehicleType,
  date,
  time,
  selectedSlotId,
  vehicleInfo,
}) => {
  const selectedSlot = pricingOptions.find(slot => slot.id === selectedSlotId)

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">📝 Step 4: Review Your Booking</h2>

      {/* Reservation Details */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reservation Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Location:" value={location || 'N/A'} />
          <InfoRow label="Vehicle Type:" value={vehicleType || 'N/A'} />
          <InfoRow label="Date:" value={date || 'N/A'} />
          <InfoRow label="Time:" value={time || 'N/A'} />
        </div>
      </div>

      {/* Parking Slot Details */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Selected Parking Slot</h3>
        {selectedSlot ? (
          <div className="space-y-4">
            <InfoRow label="Slot Type:" value={selectedSlot.label} />
            <InfoRow label="Rate:" value={`₱${selectedSlot.price} / hour`} />
            <InfoRow label="Location Type:" value={selectedSlot.type} />
            <div className="px-4 py-3 bg-gray-50 border border-dashed rounded-md text-sm text-gray-600 italic">
              {selectedSlot.notes}
            </div>
          </div>
        ) : (
          <p className="text-red-600 font-medium">No slot selected.</p>
        )}
      </div>

      {/* Vehicle Info */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Plate Number:" value={vehicleInfo.plateNumber || 'N/A'} />
          <InfoRow label="Make:" value={vehicleInfo.vehicleMake || 'N/A'} />
          <InfoRow label="Model:" value={vehicleInfo.vehicleModel || 'N/A'} />
          <InfoRow label="Color:" value={vehicleInfo.color || 'N/A'} />
        </div>
      </div>
    </div>
  )
}

export default StepReview