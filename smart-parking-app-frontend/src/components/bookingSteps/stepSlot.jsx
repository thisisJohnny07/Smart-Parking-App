import React from 'react'

const pricingOptions = [
  { id: 1, label: 'Standard Slot', price: 40, type: 'Open Space', notes: 'Ideal for sedans and hatchbacks.' },
  { id: 2, label: 'Covered Slot', price: 60, type: 'Covered', notes: 'Best for rainy weather and sun protection.' },
  { id: 3, label: 'Premium Slot', price: 80, type: 'Near Entrance', notes: 'Closest to exits and facilities.' },
]

const StepSlot = ({ selectedId, setSelectedId }) => {
  const selected = pricingOptions.find(p => p.id === selectedId)

  return (
    <div className="my-10 text-center">
      <h2 className="text-2xl font-semibold mb-6">📍 Step 2: Select a Parking Option</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {pricingOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            className={`rounded-xl border p-6 text-left transition-all text-gray-900 shadow-sm ${
              selectedId === option.id
                ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-100'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <h3 className="text-lg font-bold mb-1">{option.label}</h3>
            <p className="text-sm text-gray-600">₱{option.price} per hour</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 text-left max-w-xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold mb-2">Slot Details</h4>
          <p><strong>Type:</strong> {selected.type}</p>
          <p><strong>Description:</strong> {selected.notes}</p>
          <p><strong>Rate:</strong> ₱{selected.price} per hour</p>
        </div>
      )}
    </div>
  )
}

export default StepSlot