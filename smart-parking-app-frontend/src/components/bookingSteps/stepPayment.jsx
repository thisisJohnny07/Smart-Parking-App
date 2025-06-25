import React, { useState, useEffect } from 'react'
import { createReservation } from '../../services/reservationService'
import { initiateOnlinePayment } from '../../services/paymentService'
import { useNavigate, useLocation } from 'react-router-dom'

const paymentMethods = [
  { id: 'cash', label: 'Cash on Site', description: 'Pay directly at the parking location.' },
  { id: 'card', label: 'Visa / Mastercard', description: 'Secure payment using your credit or debit card.' },
  { id: 'gcash', label: 'GCash', description: 'Fast and convenient payment with GCash.' },
  { id: 'maya', label: 'Maya', description: 'Pay using your Maya digital wallet.' },
]

// Map UI payment method IDs to PayMongo API payment method values
const paymentMethodMapping = {
  cash: 'cash',
  card: 'card',
  gcash: 'gcash',
  maya: 'paymaya', // correct PayMongo value
}

const StepPayment = ({ locationId, vehicleTypeId, selectedSlot, date, time, vehicleInfo, totalAmount }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMethod, setSelectedMethod] = useState('cash')
  const [billingPhone, setBillingPhone] = useState('')
  const [loading, setLoading] = useState(false)

  // Detect if redirected after payment
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const status = query.get('payment')

    if (status === 'success') {
      const cached = sessionStorage.getItem('pendingReservation')
      if (cached) {
        const reservationData = JSON.parse(cached)
        createReservation(reservationData)
          .then(() => {
            sessionStorage.removeItem('pendingReservation')
            alert('✅ Payment successful and reservation saved!')
            navigate('/reservations')
          })
          .catch(() => {
            alert('❌ Payment succeeded but reservation failed to save.')
          })
      }
    }
  }, [location.search, navigate])

  const handleConfirm = async () => {
    const methodLabel = paymentMethods.find(m => m.id === selectedMethod)?.label
    const apiPaymentMethod = paymentMethodMapping[selectedMethod]

    if (selectedMethod === 'cash') {
      try {
        setLoading(true)
        const payload = {
          location: locationId,
          slot_type: selectedSlot.id,
          vehicle_type: vehicleTypeId,
          date,
          time,
          duration_hours: vehicleInfo.hours,
          plate_number: vehicleInfo.plateNumber,
          vehicle_make: vehicleInfo.vehicleMake,
          vehicle_model: vehicleInfo.vehicleModel,
          color: vehicleInfo.color,
          mode_of_payment: methodLabel,
          is_paid: false,
        }
        await createReservation(payload)
        alert('✅ Booking confirmed!')
        navigate('/reservations')
      } catch (error) {
        alert('❌ Failed to confirm booking.')
      } finally {
        setLoading(false)
      }
    } else {
      if (!billingPhone) {
        alert('📱 Please enter a billing phone number.')
        return
      }

      try {
        setLoading(true)

        const paymentPayload = {
          description: 'Reservation for slot',
          billing_phone: billingPhone,
          line_item_amount: totalAmount * 1,
          line_item_name: 'Parking Slot',
          line_item_quantity: 1,
          currency: 'PHP',
          payment_method: apiPaymentMethod, // mapped value here
        }

        const result = await initiateOnlinePayment(paymentPayload)
        const checkoutUrl = result.checkout_url

        const reservationPayload = {
          location: locationId,
          slot_type: selectedSlot.id,
          vehicle_type: vehicleTypeId,
          date,
          time,
          duration_hours: vehicleInfo.hours,
          plate_number: vehicleInfo.plateNumber,
          vehicle_make: vehicleInfo.vehicleMake,
          vehicle_model: vehicleInfo.vehicleModel,
          color: vehicleInfo.color,
          mode_of_payment: methodLabel,
          is_paid: true,
        }

        // Save to sessionStorage before redirecting
        sessionStorage.setItem('pendingReservation', JSON.stringify(reservationPayload))

        // Redirect to payment checkout
        window.location.href = checkoutUrl
      } catch (err) {
        alert('❌ Failed to initiate payment.')
      } finally {
        setLoading(false)
      }
    }
  }

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

        {selectedMethod !== 'cash' && (
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number for Billing
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="e.g. 09171234567"
              value={billingPhone}
              onChange={(e) => setBillingPhone(e.target.value)}
              maxLength={11}
            />
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <button
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? 'Processing...' : `Confirm Booking`}
        </button>
      </div>
    </div>
  )
}

export default StepPayment