import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
