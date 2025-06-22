import React, { useState } from 'react'

const paymentMethods = [
  { id: 'cash', label: 'Cash on Site', description: 'Pay directly at the parking location.' },
  { id: 'card', label: 'Visa / Mastercard', description: 'Secure payment using your credit or debit card.' },
  { id: 'gcash', label: 'GCash', description: 'Fast and convenient payment with GCash.' },
  { id: 'maya', label: 'Maya', description: 'Pay using your Maya digital wallet.' },
]

const StepPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState('cash')

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">✅ Step 5: Confirm Your Booking</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h3>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-gray-900 bg-gray-100 ring-2 ring-gray-900'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="mt-1 mr-4"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
          onClick={() => alert(`Booking confirmed with ${paymentMethods.find(p => p.id === selectedMethod).label}`)}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  )
}

export default StepPayment