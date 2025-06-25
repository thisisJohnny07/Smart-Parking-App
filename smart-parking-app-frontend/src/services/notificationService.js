import axiosInstance from './axiosInstance'

export const fetchNotificationCount = async () => {
  const res = await axiosInstance.get('/notifications/count/')
  return res.data.unread_count
}

export const fetchUnreadNotifications = async () => {
  const res = await axiosInstance.get('/notifications/unread/')
  return res.data.data
}

export const markAllNotificationsRead = async () => {
  await axiosInstance.patch('/notifications/mark-all-read/')
}