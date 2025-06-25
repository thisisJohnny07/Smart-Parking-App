import axiosInstance from './axiosInstance'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

export const getReservations = async () => {
  const res = await axiosInstance.get('/admin/reservations/')
  return res.data
}

export const getMyReservations = async () => {
  const res = await axiosInstance.get('/reservations/my/')
  return res.data
}

export const cancelReservation = async (id) => {
  const res = await axiosInstance.patch(`/admin/reservations/${id}/cancel/`, {})
  return res.data
}

export const checkInReservation = async (id) => {
  const res = await axiosInstance.patch(`/admin/reservations/${id}/check-in/`, {})
  return res.data
}

export const checkOutReservation = async (id) => {
  const res = await axiosInstance.patch(`/admin/reservations/${id}/check-out/`, {})
  return res.data
}

export const checkSlotAvailability = async ({ location_id, vehicle_type_id, date, time }) => {
  const response = await axios.post(`${API}/slots/check-availability/`, {
    location_id,
    vehicle_type_id,
    date,
    time
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response.data.results
}

export const createReservation = async (payload) => {
  const response = await axiosInstance.post('/reservations/create/', payload)
  return response.data
}

export const cancelMyReservation = async (id) => {
  try {
    const response = await axiosInstance.post(`/reservations/${id}/cancel/`)
    return response.data
  } catch (error) {
    console.error('Cancel Error:', error.response?.data || error.message)
    throw error
  }
}

// approve reservation (PATCH)
export const approveReservation = async (id) => {
  const res = await axiosInstance.patch(`/reservations/${id}/approve/`, {})
  return res.data
}

// mark reservation as paid (PUT)
export const markPaidReservation = async (id) => {
  const res = await axiosInstance.put(`/reservations/${id}/mark-paid/`, {})
  return res.data
}

export const fetchDashboardSummary = async () => {
  const res = await axiosInstance.get('/admin/dashboard/summary/')
  return res.data
}