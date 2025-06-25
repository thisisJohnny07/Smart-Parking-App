// services/axiosInstance.js
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add access token
axiosInstance.interceptors.request.use(config => {
  const auth = localStorage.getItem('auth')
  if (auth) {
    const { access } = JSON.parse(auth)
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Response interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        // Call your refresh token API
        const auth = localStorage.getItem('auth')
        if (!auth) throw new Error('No refresh token')

        const { refresh } = JSON.parse(auth)

        const refreshResponse = await axios.post(`${API}/token/refresh/`, {
          refresh,
        })

        // Update localStorage and axios headers with new token
        localStorage.setItem(
          'auth',
          JSON.stringify({
            ...JSON.parse(auth),
            access: refreshResponse.data.access,
          })
        )

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${refreshResponse.data.access}`
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`

        // Retry original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Logout or redirect user
        localStorage.removeItem('auth')
        window.location.href = '/admin/sign-in' // or however you handle logout
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance