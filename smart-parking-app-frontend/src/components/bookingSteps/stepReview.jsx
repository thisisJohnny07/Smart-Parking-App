import React from 'react'

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
  selectedSlot,
  vehicleInfo,
}) => {
  const totalCost = selectedSlot && vehicleInfo.hours
    ? selectedSlot.price * vehicleInfo.hours
    : 0

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
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Plate Number:" value={vehicleInfo.plateNumber || 'N/A'} />
          <InfoRow label="Make:" value={vehicleInfo.vehicleMake || 'N/A'} />
          <InfoRow label="Model:" value={vehicleInfo.vehicleModel || 'N/A'} />
          <InfoRow label="Color:" value={vehicleInfo.color || 'N/A'} />
          <InfoRow label="Hours:" value={vehicleInfo.hours || 'N/A'} />
        </div>
      </div>

      {/* Total Cost */}
      {selectedSlot && vehicleInfo.hours && (
        <div className="text-right mt-6 text-xl font-bold text-gray-900">
          Total Cost: ₱{totalCost}
        </div>
      )}
    </div>
  )
}

export default StepReview