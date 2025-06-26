import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReservation } from '../../services/reservationService'

const PaymentCallback = () => {
  const navigate = useNavigate()
  const hasRun = useRef(false) // Prevent multiple effect runs

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const cached = sessionStorage.getItem('pendingReservation') // Retrieve saved reservation data
    if (cached) {
      const reservationData = JSON.parse(cached)
      createReservation(reservationData) // Create reservation after payment success
        .then(() => {
          sessionStorage.removeItem('pendingReservation') // Clear cache on success
          alert('✅ Payment successful and reservation saved!')
        })
        .catch(() => {
          alert('❌ Payment succeeded but reservation failed to save.')
        })
        .finally(() => {
          navigate('/reservations') // Redirect to reservations page
        })
    } else {
      navigate('/reservations') // Redirect if no cached data found
    }
  }, [])

  return null
}

export default PaymentCallback