import axiosInstance from './axiosInstance'

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/users/')
    return response.data.map(user => ({
      id: user.id,
      username: user.username,
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      isActive: user.is_active,
      dateJoined: user.date_joined,
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

export const deactivateUser = async (id) => {
  try {
    await axiosInstance.post('/admin/deactivate-user/', { user_id: id })
  } catch (error) {
    console.error('Failed to deactivate user:', error)
    throw error
  }
}

export const activateUser = async (id) => {
  try {
    await axiosInstance.post('/admin/activate-user/', { user_id: id })
  } catch (error) {
    console.error('Failed to activate user:', error)
    throw error
  }
}