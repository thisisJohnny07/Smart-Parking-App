import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

export const login = async (username, password) => {
  try {
    console.log('Sending login request to:', `${API}/login/`)
    console.log({ username, password })
    
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
    console.error('Login error:', err.response?.data || err.message)
    throw err
  }
}

export const logout = async (refreshToken, accessToken) => {
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
  const response = await axios.post(`${API}/register/`, userData, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}