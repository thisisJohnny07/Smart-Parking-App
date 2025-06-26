import axios from 'axios'

// Base API URL with fallback
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

// Get all locations
export const getLocations = async () => {
  try {
    const response = await axios.get(`${API_BASE}/locations/`)
    return response.data
  } catch (err) {
    console.error('Error fetching locations:', err.response?.data || err.message)
    throw err
  }
}

// Delete a location by ID
export const deleteLocation = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/locations/delete/${id}/`)
    return response.data
  } catch (err) {
    console.error(`Error deleting location ${id}:`, err.response?.data || err.message)
    throw err
  }
}

// Create a new location
export const createLocation = async (data) => {
  try {
    const response = await axios.post(`${API_BASE}/locations/create/`, data)
    return response.data
  } catch (err) {
    console.error('Error creating location:', err.response?.data || err.message)
    throw err
  }
}

// Update a location by ID
export const updateLocation = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE}/locations/update/${id}/`, data)
    return response.data
  } catch (err) {
    console.error(`Error updating location ${id}:`, err.response?.data || err.message)
    throw err
  }
}

// Get combined data of locations and vehicles
export const fetchLocationsAndVehicles = async () => {
  try {
    const response = await axios.get(`${API_BASE}/data/locations-vehicles/`)
    return response.data
  } catch (err) {
    console.error('Error fetching locations and vehicles:', err.response?.data || err.message)
    throw err
  }
}