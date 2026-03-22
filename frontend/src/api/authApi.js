import axios from "axios"
import axiosInstance from "./axiosInstance"
const API_BASE = import.meta.env.VITE_API_BASE_URL

// ── Auth ──────────────────────────────────────────────────────────────────────

export const firebaseLoginApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/google`, data)
  return res.data
}

export const sendOtpApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/send-otp`, data)
  return res.data
}

export const verifyOtpApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/verify-otp`, data)
  return res.data
}

export const registerApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/register`, data)
  return res.data
}

export const emailLoginApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/login`, data)
  return res.data
}

export const forgotPasswordSendOtpApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/forgot-password/send-otp`, data)
  return res.data
}

export const resetPasswordApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/forgot-password/reset`, data)
  return res.data
}

// ── PDF ───────────────────────────────────────────────────────────────────────

export const uploadPdfApi = (file) => {
  const formData = new FormData()
  formData.append("file", file)
  return axiosInstance.post("/api/pdf/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export const processPdfApi = (documentId) => {
  return axiosInstance.post("/api/pdf/process", { documentId })
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export const createChatSessionApi = (documentId, title) => {
  return axiosInstance.post("/api/chat/session", { documentId, title })
}

export const askQuestionApi = (sessionId, question) => {
  return axiosInstance.post("/api/chat/ask", { sessionId, question })
}

export const fetchMessagesApi = (sessionId) => {
  return axiosInstance.get(`/api/chat/messages/${sessionId}`)
}

export const fetchChatSessionsApi = (userId, page = 1, pageSize = 20) => {
  return axiosInstance.get('/api/chat/sessions', { params: { page, pageSize } })
}

// ── Document ──────────────────────────────────────────────────────────────────

export const viewPdfApi = (documentId) => {
  return axiosInstance.get(`/api/document/${documentId}/view`)
}

export const deleteDocumentApi = (documentId) => {
  return axiosInstance.delete(`/api/chat/session/${documentId}`)
}