
import React, { useState, useRef, useEffect } from 'react'
import {
  Upload,
  MessageSquare,
  ArrowUpCircle,
  User,
  Sun,
  Moon,
  Menu,
  FileText,
  Eye,
  Download,
  X,
  Trash2,
} from 'lucide-react'
import Swal from 'sweetalert2'
import UserProfile from './UserProfile'
import useAuthStore from '../store/useAuthStore'
import {
  uploadPdfApi,
  processPdfApi,
  createChatSessionApi,
  askQuestionApi,
  fetchMessagesApi,
  fetchChatSessionsApi,
  viewPdfApi,
  deleteDocumentApi
} from '../api/authApi'
import { useNavigate } from 'react-router-dom'
import '../App.css'
// --- COLORS ---
const LIGHT_PRIMARY = '#4F1C51'
const DARK_PRIMARY = 'rgb(114, 73, 121)'
const LIGHT_BG = '#FFFFFF'
const DARK_BG = '#1E1E1E'
const LIGHT_HOVER_BG = '#F3E8F5'   // soft purple
const DARK_HOVER_BG = '#2A2A2A'    // dark gray

const PAGE_SIZE = 13

const ChatInterFace = () => {
  const [currentPdf, setCurrentPdf] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showProfile, setShowProfile] = useState(false)

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [chatSessionId, setChatSessionId] = useState(null)

  const [sessions, setSessions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
const [pdfLoading, setPdfLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loadingSessions, setLoadingSessions] = useState(false)
const isFetchingRef = useRef(false)

  const chatEndRef = useRef(null)
  const { user, loading } = useAuthStore()
const navigate = useNavigate()

  const PRIMARY_COLOR = theme === 'light' ? LIGHT_PRIMARY : DARK_PRIMARY
  const BACKGROUND_COLOR = theme === 'light' ? LIGHT_BG : DARK_BG
  const TEXT_COLOR = theme === 'light' ? '#000' : '#FFF'

  /* ================= THEME ================= */
  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  /* ================= RESET ON LOGIN ================= */
  useEffect(() => {
    if (!loading && user?._id) {
      setChatSessionId(null)
      setCurrentPdf(null)
      setMessages([])
      setSessions([])
      setPage(1)
      setHasNextPage(true)
    }
  }, [loading, user])

  /* ================= AUTOSCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ================= FETCH SESSIONS (PAGINATION) ================= */  
  const fetchSessions = async (pageNo = 1) => {
  console.log('📄 Fetching page:', pageNo)

  // if (loadingSessions || !hasNextPage) return
if (isFetchingRef.current || !hasNextPage) return
isFetchingRef.current = true

  setLoadingSessions(true)
  try {
    const res = await fetchChatSessionsApi(user._id, pageNo, PAGE_SIZE)

    console.log('➡️ Received:', res.data.sessions.length)
    console.log('➡️ hasNextPage:', res.data.pagination.hasNextPage)

    setSessions(prev =>
      pageNo === 1 ? res.data.sessions : [...prev, ...res.data.sessions]
    )

    setHasNextPage(res.data.pagination.hasNextPage)
    setPage(pageNo)
  } finally {
    // setLoadingSessions(false)
     isFetchingRef.current = false
  setLoadingSessions(false)
  }
}


  /* ================= LOAD WHEN SIDEBAR OPENS ================= */
  useEffect(() => {
    if (sidebarOpen && sessions.length === 0) {
      fetchSessions(1)
    }
  }, [sidebarOpen])

  /* ================= PDF UPLOAD ================= */

// const handleFileUpload = async (file) => {
//   if (!file) return

//   try {
//     const uploadRes = await uploadPdfApi(file)
//     const documentId = uploadRes.data.document._id

//     await processPdfApi(documentId)

//     const sessionRes = await createChatSessionApi(documentId, file.name)
//     const session = sessionRes.data.session

//     // ✅ UPDATE SIDEBAR IMMEDIATELY
//     setSessions(prev => {
//       const exists = prev.some(s => s._id === session._id)
//       if (exists) return prev
//       return [session, ...prev]
//     })

//     setChatSessionId(session._id)
//     setCurrentPdf({
//       name: session.title,
//       documentId: session.documentId,
//     })

//     setMessages([
//       {
//         role: 'assistant',
//         content: `📄 **${file.name}** uploaded successfully! Ask me anything about it.`,
//       },
//     ])

//   } catch (err) {
//     console.error(err)
//     alert('PDF upload failed')
//   }
// }
useEffect(() => {
  const saved = localStorage.getItem('activeChat')
  if (!saved || loading) return

  const { chatSessionId, currentPdf } = JSON.parse(saved)

  if (chatSessionId && currentPdf) {
    setChatSessionId(chatSessionId)
    setCurrentPdf(currentPdf)

    fetchMessagesApi(chatSessionId).then(res => {
      setMessages(
        res.data.messages.map(m => ({
          role: m.role,
          content: m.message,
        }))
      )
    })
  }
}, [loading])

const handleFileUpload = async (file) => {
  if (!file) return

  try {
    setPdfLoading(true)   // 🔴 START LOADER

    const uploadRes = await uploadPdfApi(file)
    const documentId = uploadRes.data.document._id

    await processPdfApi(documentId)

    const sessionRes = await createChatSessionApi(documentId, file.name)
    const session = sessionRes.data.session

    setSessions(prev => {
      const exists = prev.some(s => s._id === session._id)
      if (exists) return prev
      return [session, ...prev]
    })

    setChatSessionId(session._id)
    setCurrentPdf({
      name: session.title,
      documentId: session.documentId,
    })

    setMessages([
      {
        role: 'assistant',
        content: `📄 **${file.name}** uploaded successfully! Ask me anything about it.`,
      },
    ])

    // ✅ SAVE SESSION FOR REFRESH (important for Part 2)
    localStorage.setItem(
      'activeChat',
      JSON.stringify({
        chatSessionId: session._id,
        currentPdf: {
          name: session.title,
          documentId: session.documentId,
        },
      })
    )
  } catch (err) {
    console.error(err)
    alert('PDF upload failed')
  } finally {
    setPdfLoading(false)  // 🟢 STOP LOADER
  }
}


  /* ================= SEND MESSAGE ================= */
  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || !chatSessionId) return

    const question = input.trim()
    setInput('')

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: 'Thinking...' },
    ])

    try {
      await askQuestionApi(chatSessionId, question)
      const res = await fetchMessagesApi(chatSessionId)
      setMessages(
        res.data.messages.map((m) => ({
          role: m.role,
          content: m.message,
        }))
      )
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '❌ Failed to get response' },
      ])
    }
  }

  /* ================= OPEN SESSION ================= */
  // const openSession = async (session) => {
  //   setChatSessionId(session._id)
  //   setCurrentPdf({
  //     name: session.title,
  //     documentId: session.documentId,
  //   })

  //   const res = await fetchMessagesApi(session._id)
  //   setMessages(
  //     res.data.messages.map((m) => ({
  //       role: m.role,
  //       content: m.message,
  //     }))
  //   )
  // }

  const openSession = async (session) => {
  setChatSessionId(session._id)
  setCurrentPdf({
    name: session.title,
    documentId: session.documentId,
  })

  // ✅ persist
  localStorage.setItem(
    'activeChat',
    JSON.stringify({
      chatSessionId: session._id,
      currentPdf: {
        name: session.title,
        documentId: session.documentId,
      },
    })
  )

  const res = await fetchMessagesApi(session._id)
  setMessages(
    res.data.messages.map((m) => ({
      role: m.role,
      content: m.message,
    }))
  )
}

const SidebarSkeleton = () => (
  <div className="space-y-2 mt-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="h-8 rounded animate-pulse bg-gray-300 dark:bg-gray-700"
      />
    ))}
  </div>
)

  /* ================= DELETE SESSION ================= */

const handleDeleteChat = async (session) => {
  const result = await Swal.fire({
    title: 'Delete chat?',
    text: 'This will permanently delete this chat.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Yes, delete',
  })

  if (!result.isConfirmed) return

  try {
    await deleteDocumentApi(session.documentId)

    // ✅ Remove from sidebar instantly
    setSessions(prev => prev.filter(s => s.documentId !== session.documentId))

    // ✅ Reset chat if open
    if (chatSessionId === session.documentId) {
      setChatSessionId(null)
      setCurrentPdf(null)
      setMessages([])
    }

    // ✅ SUCCESS FEEDBACK
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Chat deleted successfully.',
      timer: 1500,
      showConfirmButton: false,
    })

  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Could not delete chat.',
    })
  }
}


 const openPdf = async () => {
    const res = await viewPdfApi(currentPdf.documentId)
    window.open(res.data.url, '_blank')
  }
const handleNewChat = () => {
  setChatSessionId(null)
  setCurrentPdf(null)
  setMessages([])
  setSidebarOpen(false)
}


const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Logout?',
    text: 'You will be logged out of your account.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
  })

  if (!result.isConfirmed) return

  // 1️⃣ Clear auth store (THIS clears token + auth state)
  useAuthStore.getState().clearUser()

  // 2️⃣ Clear local storage extras (optional)
  localStorage.removeItem('theme')

  // 3️⃣ Reset UI state
  setChatSessionId(null)
  setCurrentPdf(null)
  setMessages([])
  setSessions([])
  setSidebarOpen(false)

  // 4️⃣ Redirect
  navigate('/', { replace: true })
}



  /* ================= NAVBAR ================= */
  const NavBar = () => (
    <header
      className="flex justify-between items-center p-4 border-b"
      style={{ backgroundColor: BACKGROUND_COLOR, borderColor: PRIMARY_COLOR }}
    >
      <div className="flex items-center gap-3">
        <Menu
          size={20}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="cursor-pointer"
          style={{ color: PRIMARY_COLOR }}
        />
        <MessageSquare size={22} style={{ color: PRIMARY_COLOR }} />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? (
            <Moon size={20} style={{ color: PRIMARY_COLOR }} />
          ) : (
            <Sun size={20} style={{ color: PRIMARY_COLOR }} />
          )}
        </button>

        <div onClick={() => setShowProfile(true)} className="flex items-center gap-2 cursor-pointer">
          <span style={{ color: TEXT_COLOR }}>{user?.name || 'User'}</span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  )

  if (showProfile) return <UserProfile theme={theme} onBack={() => setShowProfile(false)} />

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: BACKGROUND_COLOR }}>
  {/* ===== SIDEBAR ===== */}


{/* ===== MOBILE BACKDROP (ONLY MOBILE) ===== */}
{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-30 md:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

{/* ===== SIDEBAR ===== */}
{sidebarOpen && (
  <div
    className={`
      fixed md:static top-0 left-0 z-40
      h-full w-64 flex flex-col
      border-r
      bg-inherit
      md:h-auto
    `}
    style={{ borderColor: PRIMARY_COLOR }}
  >
    {/* ===== MOBILE HEADER (CLOSE BUTTON) ===== */}
    <div className="flex items-center justify-between p-3 md:hidden">
      <span className="font-semibold" style={{ color: TEXT_COLOR }}>
        Chats
      </span>
      <X
        size={20}
        className="cursor-pointer"
        style={{ color: PRIMARY_COLOR }}
        onClick={() => setSidebarOpen(false)}
      />
    </div>

    {/* ===== NEW CHAT ===== */}
    <div className="p-3">
      <button
        onClick={handleNewChat}
        className="w-full py-2 rounded font-semibold"
        style={{ backgroundColor: PRIMARY_COLOR, color: '#FFF' }}
      >
        ➕ New Chat
      </button>
    </div>

    {/* ===== CHAT LIST ===== */}
    <div
      className="flex-1 p-3 overflow-y-auto sidebar-scroll"
      onScroll={(e) => {
        const el = e.target
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
          if (hasNextPage && !loadingSessions) {
            fetchSessions(page + 1)
          }
        }
      }}
    >
      {sessions.map((s) => (
        <div
     
          key={s._id}
  className="flex items-center justify-between p-2 rounded transition-colors"
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor =
      theme === 'light' ? LIGHT_HOVER_BG : DARK_HOVER_BG
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent'
  }}
        >
          <span
            onClick={() => {
              openSession(s)
              setSidebarOpen(false) // closes on mobile
            }}
            className="cursor-pointer truncate"
            style={{ color: TEXT_COLOR }}
          >
            📄 {s.title}
          </span>

          <Trash2
            size={16}
            className="cursor-pointer text-red-500"
            onClick={() => handleDeleteChat(s)}
          />
        </div>
      ))}

      {loadingSessions && <SidebarSkeleton />}

      {!hasNextPage && sessions.length > 0 && (
        <div className="text-center text-xs opacity-50 py-2" style={{
                  color: theme === 'light' ? '#0c0c0c' : '#ffffff',
                  fontWeight: 'bold',  
                  fontSize: '15px',
                  marginTop: '10px',
                  backgroundColor: theme === 'light' ? '#e0e0e0' : '#333333',
                }} >
          No more chats
        </div>
      )}
    </div>

    {/* ===== LOGOUT ===== */}
    <div className="p-3 border-t" style={{ borderColor: PRIMARY_COLOR }}>
      <button
        onClick={handleLogout}
        className="w-full py-2 rounded font-semibold"
        style={{ backgroundColor: 'rgb(105, 5, 109)', color: '#FFF' }}
      >
        Logout
      </button>
    </div>
  </div>
)}



      {/* ===== MAIN ===== */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar />
{pdfLoading && (
  <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/30">
    <div
      className="px-6 py-4 rounded-lg font-semibold animate-pulse"
      style={{
        backgroundColor: PRIMARY_COLOR,
        color: '#FFF',
      }}
    >
      Processing PDF...
    </div>
  </div>
)}

        {!currentPdf ? (
          <div className="flex-1 flex items-center justify-center px-4">
            <div
              onClick={() => document.getElementById('pdf-upload').click()}
              className="p-8 w-full max-w-sm border-4 border-dashed rounded-xl cursor-pointer text-center"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              <Upload size={48} className="mx-auto mb-4" />
              <p className="font-semibold">Drop PDF here or Click to Upload</p>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 border-b">
              <FileText size={16} style={{ color: PRIMARY_COLOR }} />
              <span className="truncate" style={{ color: TEXT_COLOR }}>
                Currently Chatting with:
                <span className="ml-2 font-bold">{currentPdf.name}</span>
              </span>

              <div className="ml-auto flex gap-3">
                <button onClick={openPdf}>
                  <Eye size={18} style={{ color: PRIMARY_COLOR }} />
                </button>
           
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="px-4 py-2 rounded-xl max-w-[70%]"
                    style={{
                      backgroundColor:
                        msg.role === 'assistant'
                          ? PRIMARY_COLOR
                          : theme === 'light'
                          ? '#F1F1F1'
                          : '#444',
                      color: msg.role === 'assistant' ? '#FFF' : TEXT_COLOR,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t flex gap-3 bg-inherit">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full outline-none"
                placeholder="Ask a question..."
                style={{
                  backgroundColor: theme === 'light' ? '#FFF' : '#444',
                  color: TEXT_COLOR,
                  border: `1px solid ${PRIMARY_COLOR}`,
                }}
              />
              <button type="submit" className="p-3 rounded-full" style={{ backgroundColor: PRIMARY_COLOR }}>
                <ArrowUpCircle size={22} color="#FFF" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ChatInterFace
