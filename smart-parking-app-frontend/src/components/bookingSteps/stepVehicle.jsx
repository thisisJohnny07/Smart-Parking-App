import React from 'react'

const StepVehicle = ({ vehicleInfo, setVehicleInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setVehicleInfo((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="my-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">🚗 Step 3: Enter Vehicle Details</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Plate Number</label>
          <input
            type="text"
            name="plateNumber"
            value={vehicleInfo.plateNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="e.g. ABC-1234"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Make</label>
          <input
            type="text"
            name="vehicleMake"
            value={vehicleInfo.vehicleMake}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="e.g. Toyota"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Model</label>
          <input
            type="text"
            name="vehicleModel"
            value={vehicleInfo.vehicleModel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="e.g. Vios"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="text"
            name="color"
            value={vehicleInfo.color}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="e.g. Silver"
            required
          />
        </div>
      </form>
    </div>
  )
}

export default StepVehicle