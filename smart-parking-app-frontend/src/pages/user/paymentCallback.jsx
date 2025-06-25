import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReservation } from '../../services/reservationService'

const PaymentCallback = () => {
  const navigate = useNavigate()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const cached = sessionStorage.getItem('pendingReservation')
    if (cached) {
      const reservationData = JSON.parse(cached)
      createReservation(reservationData)
        .then(() => {
          sessionStorage.removeItem('pendingReservation')
          alert('✅ Payment successful and reservation saved!')
        })
        .catch(() => {
          alert('❌ Payment succeeded but reservation failed to save.')
        })
        .finally(() => {
          navigate('/reservations')
        })
    } else {
      navigate('/reservations') // fallback if no data
    }
  }, [])

  return null
}

export default PaymentCallback