import axios from 'axios'

// Get base API URL from environment variables
const API = import.meta.env.VITE_API_BASE_URL

export const login = async (username, password) => {
  try {
    console.log('Sending login request to:', `${API}/login/`)
    console.log({ username, password })
    
    // Send login request
    const response = await axios.post(`${API}/login/`, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    return response.data
  } catch (err) {
    // Log error if login fails
    console.error('Login error:', err.response?.data || err.message)
    throw err
  }
}

export const logout = async (refreshToken, accessToken) => {
  // Send logout request with refresh token and auth header
  return axios.post(`${API}/logout/`, 
    { refresh: refreshToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    }
  )
}

export const register = async (userData) => {
  try {
    // Send registration request
    const response = await axios.post(`${API}/register/`, userData, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (err) {
    // Log error if registration fails
    console.error('Registration error:', err.response?.data || err.message)
    throw err
  }
}