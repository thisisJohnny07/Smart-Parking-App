import axiosInstance from './axiosInstance'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Fetch all reservations (admin)
export const getReservations = async () => {
  try {
    const res = await axiosInstance.get('/admin/reservations/')
    return res.data
  } catch (err) {
    console.error('Error fetching reservations:', err.response?.data || err.message)
    throw err
  }
}

// Fetch reservations for current user
export const getMyReservations = async () => {
  try {
    const res = await axiosInstance.get('/reservations/my/')
    return res.data
  } catch (err) {
    console.error('Error fetching my reservations:', err.response?.data || err.message)
    throw err
  }
}

// Cancel a reservation (admin)
export const cancelReservation = async (id) => {
  try {
    const res = await axiosInstance.patch(`/admin/reservations/${id}/cancel/`, {})
    return res.data
  } catch (err) {
    console.error(`Error cancelling reservation ${id}:`, err.response?.data || err.message)
    throw err
  }
}

// Check-in reservation (admin)
export const checkInReservation = async (id) => {
  try {
    const res = await axiosInstance.patch(`/admin/reservations/${id}/check-in/`, {})
    return res.data
  } catch (err) {
    console.error(`Error checking in reservation ${id}:`, err.response?.data || err.message)
    throw err
  }
}

// Check-out reservation (admin)
export const checkOutReservation = async (id) => {
  try {
    const res = await axiosInstance.patch(`/admin/reservations/${id}/check-out/`, {})
    return res.data
  } catch (err) {
    console.error(`Error checking out reservation ${id}:`, err.response?.data || err.message)
    throw err
  }
}

// Check slot availability
export const checkSlotAvailability = async ({ location_id, vehicle_type_id, date, time }) => {
  try {
    const response = await axios.post(`${API}/slots/check-availability/`, {
      location_id,
      vehicle_type_id,
      date,
      time
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data.results
  } catch (err) {
    console.error('Error checking slot availability:', err.response?.data || err.message)
    throw err
  }
}

// Create reservation
export const createReservation = async (payload) => {
  try {
    const response = await axiosInstance.post('/reservations/create/', payload)
    return response.data
  } catch (err) {
    console.error('Error creating reservation:', err.response?.data || err.message)
    throw err
  }
}

// Cancel reservation (user)
export const cancelMyReservation = async (id) => {
  try {
    const response = await axiosInstance.post(`/reservations/${id}/cancel/`)
    return response.data
  } catch (error) {
    console.error('Cancel Error:', error.response?.data || error.message)
    throw error
  }
}

// Approve reservation (admin)
export const approveReservation = async (id) => {
  try {
    const res = await axiosInstance.patch(`/reservations/${id}/approve/`, {})
    return res.data
  } catch (err) {
    console.error(`Error approving reservation ${id}:`, err.response?.data || err.message)
    throw err
  }
}

// Mark reservation as paid (admin)
export const markPaidReservation = async (id) => {
  try {
    const res = await axiosInstance.put(`/reservations/${id}/mark-paid/`, {})
    return res.data
  } catch (err) {
    console.error(`Error marking reservation ${id} as paid:`, err.response?.data || err.message)
    throw err
  }
}

// Fetch dashboard summary (admin)
export const fetchDashboardSummary = async () => {
  try {
    const res = await axiosInstance.get('/admin/dashboard/summary/')
    return res.data
  } catch (err) {
    console.error('Error fetching dashboard summary:', err.response?.data || err.message)
    throw err
  }
}