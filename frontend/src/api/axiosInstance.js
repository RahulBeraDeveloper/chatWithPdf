
import axios from 'axios'
import { showError } from '../utils/alert'
import useAuthStore from '../store/useAuthStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  console.error(' VITE_API_BASE_URL is not defined')
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // optional but good practice
})

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'

    // AUTO LOGOUT IF TOKEN EXPIRED
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('activeChat')

      window.location.href = '/'
      return Promise.reject(error)
    }

    // NETWORK ERROR
    if (!error.response) {
      showError('Network error. Please check your internet connection.')
      return Promise.reject(error)
    }

    // COMMON ERROR POPUP
    showError(message)

    return Promise.reject(error)
  }
)

export default axiosInstance