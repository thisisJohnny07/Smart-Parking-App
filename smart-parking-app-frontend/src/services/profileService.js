import axiosInstance from './axiosInstance'

// Fetch user profile
export const fetchUserProfile = async () => {
  const res = await axiosInstance.get('/user/profile/')
  return res.data.data
}

// Update user profile
export const updateUserProfile = async (payload) => {
  const res = await axiosInstance.put('/user/update/', payload)
  return res.data
}

// Change password
export const changePassword = async (payload) => {
  const res = await axiosInstance.put('/user/change-password/', payload)
  return res.data
}