import axiosInstance from './axiosInstance'

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const res = await axiosInstance.get('/user/profile/')
    return res.data.data
  } catch (err) {
    console.error('Error fetching user profile:', err.response?.data || err.message)
    throw err
  }
}

// Update user profile
export const updateUserProfile = async (payload) => {
  try {
    const res = await axiosInstance.put('/user/update/', payload)
    return res.data
  } catch (err) {
    console.error('Error updating user profile:', err.response?.data || err.message)
    throw err
  }
}

// Change password
export const changePassword = async (payload) => {
  try {
    const res = await axiosInstance.put('/user/change-password/', payload)
    return res.data
  } catch (err) {
    console.error('Error changing password:', err.response?.data || err.message)
    throw err
  }
}