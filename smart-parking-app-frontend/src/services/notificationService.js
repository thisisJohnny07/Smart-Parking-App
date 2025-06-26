import axiosInstance from './axiosInstance'

// Fetch count of unread notifications
export const fetchNotificationCount = async () => {
  try {
    const res = await axiosInstance.get('/notifications/count/')
    return res.data.unread_count
  } catch (err) {
    console.error('Error fetching notification count:', err.response?.data || err.message)
    throw err
  }
}

// Fetch all unread notifications
export const fetchUnreadNotifications = async () => {
  try {
    const res = await axiosInstance.get('/notifications/unread/')
    return res.data.data
  } catch (err) {
    console.error('Error fetching unread notifications:', err.response?.data || err.message)
    throw err
  }
}

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  try {
    await axiosInstance.patch('/notifications/mark-all-read/')
  } catch (err) {
    console.error('Error marking notifications as read:', err.response?.data || err.message)
    throw err
  }
}