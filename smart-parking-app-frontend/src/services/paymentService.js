import axiosInstance from './axiosInstance'

// Initiate an online payment with given payload
export const initiateOnlinePayment = async (payload) => {
  try {
    const response = await axiosInstance.post('/online-payments/', payload)
    return response.data.data
  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message)
    throw error
  }
}