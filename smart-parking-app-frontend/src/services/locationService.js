import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const getLocations = async () => {
  const response = await axios.get(`${API_BASE}/locations/`)
  return response.data
}

export const deleteLocation = async (id) => {
  const response = await axios.delete(`${API_BASE}/locations/delete/${id}/`)
  return response.data
}

export const createLocation = async (data) => {
  const response = await axios.post(`${API_BASE}/locations/create/`, data)
  return response.data
}

export const updateLocation = async (id, data) => {
  const response = await axios.put(`${API_BASE}/locations/update/${id}/`, data)
  return response.data
}

export const fetchLocationsAndVehicles = async () => {
  const response = await axios.get(`${API_BASE}/data/locations-vehicles/`)
  return response.data
}