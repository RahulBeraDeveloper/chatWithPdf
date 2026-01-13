import axios from "axios"
import axiosInstance from "./axiosInstance"
const API_BASE = import.meta.env.VITE_API_BASE_URL


// Register user using backend email/password
export const firebaseLoginApi = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/google`, data)
  return res.data
}

// ---------- PDF ----------
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

// ---------- CHAT ----------
export const createChatSessionApi = (documentId, title) => {
  return axiosInstance.post("/api/chat/session", {
    documentId,
    title,
  })
}

export const askQuestionApi = (sessionId, question) => {
  return axiosInstance.post("/api/chat/ask", {
    sessionId,
    question,
  })
}

export const fetchMessagesApi = (sessionId) => {
  return axiosInstance.get(`/api/chat/messages/${sessionId}`)
}


export const fetchChatSessionsApi = (userId, page = 1, pageSize = 20) => {
  return axiosInstance.get('/api/chat/sessions', {
    params: {
      page,
      pageSize,
    },
  })
}


// ---------- DOCUMENT ----------
export const viewPdfApi = (documentId) => {
  return axiosInstance.get(`/api/document/${documentId}/view`)
}

export const deleteDocumentApi = (documentId) => {
  return axiosInstance.delete(`/api/chat/session/${documentId}`)
}
