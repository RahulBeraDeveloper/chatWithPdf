import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL is not defined')
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Optionally add interceptors for token handling
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log("➡️ AUTH HEADER:", token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export default axiosInstance
