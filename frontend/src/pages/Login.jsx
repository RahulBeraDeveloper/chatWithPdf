// import { useState } from 'react'
// import imageSrc from '../assets/images/AIchatBot.jpg'
// import { useNavigate } from 'react-router-dom'
// import Loader from '../components/Loader.jsx'

// import { auth, provider } from '../firebase'
// import { signInWithPopup } from 'firebase/auth'

// import { firebaseLoginApi, sendOtpApi, verifyOtpApi, registerApi, emailLoginApi } from '../api/authApi'
// import useAuthStore from '../store/useAuthStore'

// import { FcGoogle } from 'react-icons/fc'
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

// const PRIMARY_COLOR = '#4F1C51'
// const SHADOW_RGB = '79, 28, 81'

// const TAB_LOGIN = 'login'
// const TAB_REGISTER = 'register'

// const STEP_INFO = 1
// const STEP_OTP  = 2
// const STEP_PASS = 3

// const Login = () => {
//   const { setUser, setLoading, loading } = useAuthStore()
//   const navigate = useNavigate()

//   const [tab, setTab] = useState(TAB_LOGIN)

//   const [loginEmail, setLoginEmail] = useState('')
//   const [loginPassword, setLoginPassword] = useState('')
//   const [showLoginPass, setShowLoginPass] = useState(false)

//   const [regStep, setRegStep] = useState(STEP_INFO)
//   const [regName, setRegName] = useState('')
//   const [regEmail, setRegEmail] = useState('')
//   const [regOtp, setRegOtp] = useState('')
//   const [regPassword, setRegPassword] = useState('')
//   const [regConfirm, setRegConfirm] = useState('')
//   const [showRegPass, setShowRegPass] = useState(false)
//   const [showRegConfirm, setShowRegConfirm] = useState(false)

//   const [error, setError] = useState('')
//   const [info, setInfo] = useState('')

//   const saveAndNavigate = (res) => {
//     localStorage.setItem('token', res.token)
//     localStorage.setItem('user', JSON.stringify(res.user))
//     localStorage.removeItem('activeChat')
//     setUser(
//       { _id: res.user._id, name: res.user.name, email: res.user.email, photo: res.user.photoUrl,  authProvider: res.user.authProvider, },
//       res.token
//     )
//     navigate('/chat')
//   }

//   const clearMessages = () => { setError(''); setInfo('') }

//   const handleGoogleSignIn = async () => {
//     try {
//       clearMessages()
//       setLoading(true)
//       const result = await signInWithPopup(auth, provider)
//       const idToken = await result.user.getIdToken()
//       const res = await firebaseLoginApi({ idToken })
//       saveAndNavigate(res)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to sign in with Google.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEmailLogin = async (e) => {
//     e.preventDefault()
//     clearMessages()
//     if (!loginEmail || !loginPassword) { setError('Please fill in all fields.'); return }
//     try {
//       setLoading(true)
//       const res = await emailLoginApi({ email: loginEmail, password: loginPassword })
//       saveAndNavigate(res)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSendOtp = async (e) => {
//     e.preventDefault()
//     clearMessages()
//     if (!regName.trim()) { setError('Please enter your name.'); return }
//     if (!regEmail.trim()) { setError('Please enter your email.'); return }
//     try {
//       setLoading(true)
//       await sendOtpApi({ email: regEmail })
//       setInfo(`OTP sent to ${regEmail}. Check your inbox.`)
//       setRegStep(STEP_OTP)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to send OTP.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault()
//     clearMessages()
//     if (!regOtp.trim()) { setError('Please enter the OTP.'); return }
//     try {
//       setLoading(true)
//       await verifyOtpApi({ email: regEmail, otp: regOtp })
//       setInfo('Email verified! Now set your password.')
//       setRegStep(STEP_PASS)
//     } catch (err) {
//       setError(err.response?.data?.message || 'OTP verification failed.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRegister = async (e) => {
//     e.preventDefault()
//     clearMessages()
//     if (!regPassword) { setError('Please enter a password.'); return }
//     if (regPassword !== regConfirm) { setError('Passwords do not match.'); return }
//     if (regPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
//     try {
//       setLoading(true)
//       const res = await registerApi({ name: regName, email: regEmail, password: regPassword })
//       saveAndNavigate(res)
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResendOtp = async () => {
//     clearMessages()
//     try {
//       setLoading(true)
//       await sendOtpApi({ email: regEmail })
//       setInfo('New OTP sent!')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to resend OTP.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent'
//   const steps = ['Info', 'Verify', 'Password']

//   return (
//     <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-stone-950 to-gray-800 flex items-center justify-center px-4 sm:px-8 font-sans">

//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <Loader />
//         </div>
//       )}

//       <style>{`
//         .google-btn:hover { box-shadow: 0 8px 25px rgba(${SHADOW_RGB}, 0.25); transform: translateY(-1px); }
//         .primary-btn { background-color: ${PRIMARY_COLOR}; }
//         .primary-btn:hover { opacity: 0.88; transform: translateY(-1px); }
//         .tab-active { border-bottom: 2px solid ${PRIMARY_COLOR}; color: ${PRIMARY_COLOR}; font-weight: 600; }
//         .tab-inactive { border-bottom: 2px solid transparent; color: #6b7280; }
//       `}</style>

//       <div
//         className="flex flex-col md:flex-row w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border md:min-h-[80vh]"
//         style={{ borderColor: PRIMARY_COLOR }}
//       >

//         {/* LEFT PANEL */}
//         <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-10 sm:px-10 order-2 md:order-1">
//           <div className="w-full max-w-sm">

//             {/* Tabs */}
//             <div className="flex mb-6 border-b border-gray-200">
//               <button
//                 onClick={() => { setTab(TAB_LOGIN); clearMessages(); setRegStep(STEP_INFO) }}
//                 className={`flex-1 pb-2 text-sm transition-all ${tab === TAB_LOGIN ? 'tab-active' : 'tab-inactive'}`}
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => { setTab(TAB_REGISTER); clearMessages(); setRegStep(STEP_INFO) }}
//                 className={`flex-1 pb-2 text-sm transition-all ${tab === TAB_REGISTER ? 'tab-active' : 'tab-inactive'}`}
//               >
//                 Register
//               </button>
//             </div>

//             {error && (
//               <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{error}</div>
//             )}
//             {info && (
//               <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 text-green-600 rounded-lg text-xs">{info}</div>
//             )}

//             {/* LOGIN TAB */}
//             {tab === TAB_LOGIN && (
//               <div>
//                 <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Welcome back!</h2>
//                 <form onSubmit={handleEmailLogin} className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
//                     <input type="email" placeholder="you@example.com" value={loginEmail}
//                       onChange={e => setLoginEmail(e.target.value)} className={inputCls} />
//                   </div>
//                   <div className="relative">
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
//                     <input type={showLoginPass ? 'text' : 'password'} placeholder="••••••••" value={loginPassword}
//                       onChange={e => setLoginPassword(e.target.value)} className={inputCls + ' pr-10'} />
//                     <button type="button" onClick={() => setShowLoginPass(p => !p)}
//                       className="absolute right-3 top-[30px] text-gray-400">
//                       {showLoginPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
//                     </button>
//                   </div>
//                   <button type="submit" disabled={loading}
//                     className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
//                     Sign In
//                   </button>
//                 </form>

//                 <div className="flex items-center my-4 gap-2">
//                   <div className="flex-1 h-px bg-gray-200" />
//                   <span className="text-xs text-gray-400">or</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>

//                 <button onClick={handleGoogleSignIn} disabled={loading}
//                   className={`google-btn w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
//                   <FcGoogle size={20} />
//                   <span>Continue with Google</span>
//                 </button>
//               </div>
//             )}

//             {/* REGISTER TAB */}
//             {tab === TAB_REGISTER && (
//               <div>
//                 <h2 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">Create Account</h2>

//                 {/* Step Indicator */}
//                 <div className="flex items-center justify-center gap-1 mb-6">
//                   {steps.map((s, i) => {
//                     const stepNum = i + 1
//                     const active = regStep === stepNum
//                     const done = regStep > stepNum
//                     return (
//                       <div key={s} className="flex items-center gap-1">
//                         <div
//                           className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
//                             ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-200 text-gray-400'}`}
//                           style={active ? { backgroundColor: PRIMARY_COLOR } : {}}
//                         >
//                           {done ? '✓' : stepNum}
//                         </div>
//                         <span className={`text-xs ${active ? 'font-semibold' : 'text-gray-400'}`}
//                           style={active ? { color: PRIMARY_COLOR } : {}}>{s}</span>
//                         {i < steps.length - 1 && <div className="w-4 h-px bg-gray-300 mx-1" />}
//                       </div>
//                     )
//                   })}
//                 </div>

//                 {/* Step 1 */}
//                 {regStep === STEP_INFO && (
//                   <form onSubmit={handleSendOtp} className="space-y-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
//                       <input type="text" placeholder="John Doe" value={regName}
//                         onChange={e => setRegName(e.target.value)} className={inputCls} />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
//                       <input type="email" placeholder="you@example.com" value={regEmail}
//                         onChange={e => setRegEmail(e.target.value)} className={inputCls} />
//                     </div>
//                     <button type="submit" disabled={loading}
//                       className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
//                       Send OTP
//                     </button>
//                     <div className="flex items-center my-2 gap-2">
//                       <div className="flex-1 h-px bg-gray-200" />
//                       <span className="text-xs text-gray-400">or</span>
//                       <div className="flex-1 h-px bg-gray-200" />
//                     </div>
//                     <button type="button" onClick={handleGoogleSignIn} disabled={loading}
//                       className={`google-btn w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
//                       <FcGoogle size={20} />
//                       <span>Register with Google</span>
//                     </button>
//                   </form>
//                 )}

//                 {/* Step 2 */}
//                 {regStep === STEP_OTP && (
//                   <form onSubmit={handleVerifyOtp} className="space-y-4">
//                     <p className="text-sm text-gray-500 text-center">
//                       We sent a 6-digit OTP to <span className="font-semibold text-gray-700">{regEmail}</span>
//                     </p>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-1">Enter OTP</label>
//                       <input type="text" maxLength={6} placeholder="123456" value={regOtp}
//                         onChange={e => setRegOtp(e.target.value.replace(/\D/g, ''))}
//                         className={inputCls + ' text-center text-xl tracking-widest font-bold'} />
//                     </div>
//                     <button type="submit" disabled={loading}
//                       className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
//                       Verify OTP
//                     </button>
//                     <div className="flex justify-between text-xs text-gray-400 mt-1">
//                       <button type="button" onClick={() => { clearMessages(); setRegStep(STEP_INFO) }} className="hover:underline">
//                         ← Change email
//                       </button>
//                       <button type="button" onClick={handleResendOtp} className="hover:underline">
//                         Resend OTP
//                       </button>
//                     </div>
//                   </form>
//                 )}

//                 {/* Step 3 */}
//                 {regStep === STEP_PASS && (
//                   <form onSubmit={handleRegister} className="space-y-4">
//                     <div className="relative">
//                       <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
//                       <input type={showRegPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={regPassword}
//                         onChange={e => setRegPassword(e.target.value)} className={inputCls + ' pr-10'} />
//                       <button type="button" onClick={() => setShowRegPass(p => !p)}
//                         className="absolute right-3 top-[30px] text-gray-400">
//                         {showRegPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
//                       </button>
//                     </div>
//                     <div className="relative">
//                       <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
//                       <input type={showRegConfirm ? 'text' : 'password'} placeholder="Repeat password" value={regConfirm}
//                         onChange={e => setRegConfirm(e.target.value)} className={inputCls + ' pr-10'} />
//                       <button type="button" onClick={() => setShowRegConfirm(p => !p)}
//                         className="absolute right-3 top-[30px] text-gray-400">
//                         {showRegConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
//                       </button>
//                     </div>
//                     <button type="submit" disabled={loading}
//                       className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
//                       Create Account
//                     </button>
//                   </form>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-stone-950 to-gray-800 py-10 md:py-16 order-1 md:order-2">
//           <div className="w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gray-900/40 rounded-2xl shadow-xl overflow-hidden border"
//             style={{ borderColor: PRIMARY_COLOR }}>
//             <img src={imageSrc} alt="AI Assistant" className="w-full h-full object-cover opacity-85" />
//           </div>
//           <div className="mt-4 md:mt-8 lg:mt-10 px-4">
//             <h3 className="text-white text-sm sm:text-lg font-bold tracking-wide text-center px-4 py-2 rounded-lg"
//               style={{ backgroundColor: `${PRIMARY_COLOR}CC` }}>
//               Chat with your documents, instantly
//             </h3>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Login

import { useState, useEffect } from 'react'
import imageSrc from '../assets/images/AIchatBot.jpg'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader.jsx'

import { auth, provider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'

import {
  firebaseLoginApi, sendOtpApi, verifyOtpApi,
  registerApi, emailLoginApi,
  forgotPasswordSendOtpApi, resetPasswordApi
} from '../api/authApi'
import useAuthStore from '../store/useAuthStore'

import { FcGoogle } from 'react-icons/fc'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const PRIMARY_COLOR = '#4F1C51'
const SHADOW_RGB    = '79, 28, 81'

const TAB_LOGIN    = 'login'
const TAB_REGISTER = 'register'

const STEP_INFO = 1
const STEP_OTP  = 2
const STEP_PASS = 3

const FP_EMAIL = 1
const FP_OTP   = 2
const FP_PASS  = 3

const Login = () => {
  const { setUser, setLoading, loading, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  // ✅ Already logged in → skip login page
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isAuthenticated) {
      navigate('/chat', { replace: true })
    }
  }, [])

  const [tab, setTab] = useState(TAB_LOGIN)

  // Login
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)

  // Register
  const [regStep, setRegStep]           = useState(STEP_INFO)
  const [regName, setRegName]           = useState('')
  const [regEmail, setRegEmail]         = useState('')
  const [regOtp, setRegOtp]             = useState('')
  const [regPassword, setRegPassword]   = useState('')
  const [regConfirm, setRegConfirm]     = useState('')
  const [showRegPass, setShowRegPass]       = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)

  // Forgot password
  const [showForgot, setShowForgot]         = useState(false)
  const [fpStep, setFpStep]                 = useState(FP_EMAIL)
  const [fpEmail, setFpEmail]               = useState('')
  const [fpOtp, setFpOtp]                   = useState('')
  const [fpPassword, setFpPassword]         = useState('')
  const [fpConfirm, setFpConfirm]           = useState('')
  const [showFpPass, setShowFpPass]         = useState(false)
  const [showFpConfirm, setShowFpConfirm]   = useState(false)

  const [error, setError] = useState('')
  const [info, setInfo]   = useState('')

  const clearMessages = () => { setError(''); setInfo('') }

  // ── Save & Navigate ──────────────────────────────────────────────────────
  const saveAndNavigate = (res) => {
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    localStorage.removeItem('activeChat')

    setUser(
      {
        _id: res.user._id,
        name: res.user.name,
        email: res.user.email,
        photo: res.user.photoUrl || null,
        photoUrl: res.user.photoUrl || null,
        authProvider: res.user.authProvider,
      },
      res.token
    )

    navigate('/chat', { replace: true })
  }

  // ── Google ───────────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      clearMessages(); setLoading(true)
      const result  = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()
      const res     = await firebaseLoginApi({ idToken })
      saveAndNavigate(res)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in with Google.')
    } finally { setLoading(false) }
  }

  // ── Email Login ──────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault(); clearMessages()
    if (!loginEmail || !loginPassword) { setError('Please fill in all fields.'); return }
    try {
      setLoading(true)
      const res = await emailLoginApi({ email: loginEmail, password: loginPassword })
      saveAndNavigate(res)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally { setLoading(false) }
  }

  // ── Register ─────────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault(); clearMessages()
    if (!regName.trim()) { setError('Please enter your name.'); return }
    if (!regEmail.trim()) { setError('Please enter your email.'); return }
    try {
      setLoading(true)
      await sendOtpApi({ email: regEmail })
      setInfo(`OTP sent to ${regEmail}. Check your inbox.`)
      setRegStep(STEP_OTP)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.')
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); clearMessages()
    if (!regOtp.trim()) { setError('Please enter the OTP.'); return }
    try {
      setLoading(true)
      await verifyOtpApi({ email: regEmail, otp: regOtp })
      setInfo('Email verified! Now set your password.')
      setRegStep(STEP_PASS)
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault(); clearMessages()
    if (!regPassword) { setError('Please enter a password.'); return }
    if (regPassword !== regConfirm) { setError('Passwords do not match.'); return }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    try {
      setLoading(true)
      const res = await registerApi({ name: regName, email: regEmail, password: regPassword })
      saveAndNavigate(res)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  const handleResendOtp = async () => {
    clearMessages()
    try {
      setLoading(true)
      await sendOtpApi({ email: regEmail })
      setInfo('New OTP sent!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.')
    } finally { setLoading(false) }
  }

  // ── Forgot Password ──────────────────────────────────────────────────────
  const openForgot = () => {
    clearMessages()
    setFpStep(FP_EMAIL)
    setFpEmail(''); setFpOtp(''); setFpPassword(''); setFpConfirm('')
    setShowForgot(true)
  }

  const handleFpSendOtp = async (e) => {
    e.preventDefault(); clearMessages()
    if (!fpEmail.trim()) { setError('Please enter your email.'); return }
    try {
      setLoading(true)
      await forgotPasswordSendOtpApi({ email: fpEmail })
      setInfo(`OTP sent to ${fpEmail}`)
      setFpStep(FP_OTP)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.')
    } finally { setLoading(false) }
  }

  const handleFpVerifyOtp = async (e) => {
    e.preventDefault(); clearMessages()
    if (!fpOtp.trim()) { setError('Please enter the OTP.'); return }
    try {
      setLoading(true)
      await verifyOtpApi({ email: fpEmail, otp: fpOtp })
      setInfo('OTP verified! Set your new password.')
      setFpStep(FP_PASS)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.')
    } finally { setLoading(false) }
  }

  const handleFpResetPassword = async (e) => {
    e.preventDefault(); clearMessages()
    if (!fpPassword) { setError('Please enter a new password.'); return }
    if (fpPassword !== fpConfirm) { setError('Passwords do not match.'); return }
    if (fpPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    try {
      setLoading(true)
      await resetPasswordApi({ email: fpEmail, otp: fpOtp, newPassword: fpPassword })
      setShowForgot(false)
      setTab(TAB_LOGIN)
      clearMessages()
      setInfo('Password reset! Please login with your new password.')
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.')
    } finally { setLoading(false) }
  }

  const handleFpResendOtp = async () => {
    clearMessages()
    try {
      setLoading(true)
      await forgotPasswordSendOtpApi({ email: fpEmail })
      setInfo('New OTP sent!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.')
    } finally { setLoading(false) }
  }

  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent'
  const steps    = ['Info', 'Verify', 'Password']
  const fpSteps  = ['Email', 'OTP', 'New Password']

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-stone-950 to-gray-800 flex items-center justify-center px-4 sm:px-8 font-sans">

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      <style>{`
        .google-btn:hover { box-shadow: 0 8px 25px rgba(${SHADOW_RGB}, 0.25); transform: translateY(-1px); }
        .primary-btn { background-color: ${PRIMARY_COLOR}; }
        .primary-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .tab-active { border-bottom: 2px solid ${PRIMARY_COLOR}; color: ${PRIMARY_COLOR}; font-weight: 600; }
        .tab-inactive { border-bottom: 2px solid transparent; color: #6b7280; }
      `}</style>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      {showForgot && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => { setShowForgot(false); clearMessages() }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >✕</button>

            <h2 className="text-xl font-bold mb-1" style={{ color: PRIMARY_COLOR }}>Forgot Password</h2>
            <p className="text-xs text-gray-400 mb-4">We'll send an OTP to verify it's you</p>

            <div className="flex items-center justify-center gap-1 mb-5">
              {fpSteps.map((s, i) => {
                const stepNum = i + 1
                const active  = fpStep === stepNum
                const done    = fpStep > stepNum
                return (
                  <div key={s} className="flex items-center gap-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-200 text-gray-400'}`}
                      style={active ? { backgroundColor: PRIMARY_COLOR } : {}}
                    >
                      {done ? '✓' : stepNum}
                    </div>
                    <span className="text-xs text-gray-400">{s}</span>
                    {i < fpSteps.length - 1 && <div className="w-4 h-px bg-gray-300 mx-1" />}
                  </div>
                )
              })}
            </div>

            {error && <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{error}</div>}
            {info  && <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 text-green-600 rounded-lg text-xs">{info}</div>}

            {fpStep === FP_EMAIL && (
              <form onSubmit={handleFpSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Registered Email</label>
                  <input type="email" placeholder="you@example.com" value={fpEmail}
                    onChange={e => setFpEmail(e.target.value)} className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm disabled:opacity-60">
                  Send OTP
                </button>
              </form>
            )}

            {fpStep === FP_OTP && (
              <form onSubmit={handleFpVerifyOtp} className="space-y-4">
                <p className="text-xs text-gray-500 text-center">
                  OTP sent to <span className="font-semibold text-gray-700">{fpEmail}</span>
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Enter OTP</label>
                  <input type="text" maxLength={6} placeholder="123456" value={fpOtp}
                    onChange={e => setFpOtp(e.target.value.replace(/\D/g, ''))}
                    className={inputCls + ' text-center text-xl tracking-widest font-bold'} />
                </div>
                <button type="submit" disabled={loading}
                  className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm disabled:opacity-60">
                  Verify OTP
                </button>
                <div className="flex justify-between text-xs text-gray-400">
                  <button type="button" onClick={() => { clearMessages(); setFpStep(FP_EMAIL) }} className="hover:underline">
                    ← Change email
                  </button>
                  <button type="button" onClick={handleFpResendOtp} className="hover:underline">
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {fpStep === FP_PASS && (
              <form onSubmit={handleFpResetPassword} className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <input type={showFpPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={fpPassword}
                    onChange={e => setFpPassword(e.target.value)} className={inputCls + ' pr-10'} />
                  <button type="button" onClick={() => setShowFpPass(p => !p)}
                    className="absolute right-3 top-[30px] text-gray-400">
                    {showFpPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                  <input type={showFpConfirm ? 'text' : 'password'} placeholder="Repeat password" value={fpConfirm}
                    onChange={e => setFpConfirm(e.target.value)} className={inputCls + ' pr-10'} />
                  <button type="button" onClick={() => setShowFpConfirm(p => !p)}
                    className="absolute right-3 top-[30px] text-gray-400">
                    {showFpConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                </div>
                <button type="submit" disabled={loading}
                  className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm disabled:opacity-60">
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Main Card ─────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border md:min-h-[80vh]"
        style={{ borderColor: PRIMARY_COLOR }}
      >
        {/* LEFT PANEL */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-10 sm:px-10 order-2 md:order-1">
          <div className="w-full max-w-sm">

            <div className="flex mb-6 border-b border-gray-200">
              <button onClick={() => { setTab(TAB_LOGIN); clearMessages(); setRegStep(STEP_INFO) }}
                className={`flex-1 pb-2 text-sm transition-all ${tab === TAB_LOGIN ? 'tab-active' : 'tab-inactive'}`}>
                Sign In
              </button>
              <button onClick={() => { setTab(TAB_REGISTER); clearMessages(); setRegStep(STEP_INFO) }}
                className={`flex-1 pb-2 text-sm transition-all ${tab === TAB_REGISTER ? 'tab-active' : 'tab-inactive'}`}>
                Register
              </button>
            </div>

            {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">{error}</div>}
            {info  && <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 text-green-600 rounded-lg text-xs">{info}</div>}

            {/* ── LOGIN TAB ── */}
            {tab === TAB_LOGIN && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Welcome back!</h2>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input type="email" placeholder="you@example.com" value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)} className={inputCls} />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                    <input type={showLoginPass ? 'text' : 'password'} placeholder="••••••••" value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)} className={inputCls + ' pr-10'} />
                    <button type="button" onClick={() => setShowLoginPass(p => !p)}
                      className="absolute right-3 top-[30px] text-gray-400">
                      {showLoginPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                    </button>
                  </div>

                  <div className="text-right -mt-2">
                    <button type="button" onClick={openForgot}
                      className="text-xs hover:underline" style={{ color: PRIMARY_COLOR }}>
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
                    Sign In
                  </button>
                </form>

                <div className="flex items-center my-4 gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button onClick={handleGoogleSignIn} disabled={loading}
                  className={`google-btn w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <FcGoogle size={20} />
                  <span>Continue with Google</span>
                </button>
              </div>
            )}

            {/* ── REGISTER TAB ── */}
            {tab === TAB_REGISTER && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">Create Account</h2>

                <div className="flex items-center justify-center gap-1 mb-6">
                  {steps.map((s, i) => {
                    const stepNum = i + 1
                    const active  = regStep === stepNum
                    const done    = regStep > stepNum
                    return (
                      <div key={s} className="flex items-center gap-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                            ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-200 text-gray-400'}`}
                          style={active ? { backgroundColor: PRIMARY_COLOR } : {}}
                        >
                          {done ? '✓' : stepNum}
                        </div>
                        <span className={`text-xs ${active ? 'font-semibold' : 'text-gray-400'}`}
                          style={active ? { color: PRIMARY_COLOR } : {}}>{s}</span>
                        {i < steps.length - 1 && <div className="w-4 h-px bg-gray-300 mx-1" />}
                      </div>
                    )
                  })}
                </div>

                {regStep === STEP_INFO && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                      <input type="text" placeholder="John Doe" value={regName}
                        onChange={e => setRegName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <input type="email" placeholder="you@example.com" value={regEmail}
                        onChange={e => setRegEmail(e.target.value)} className={inputCls} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
                      Send OTP
                    </button>
                    <div className="flex items-center my-2 gap-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">or</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <button type="button" onClick={handleGoogleSignIn} disabled={loading}
                      className={`google-btn w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <FcGoogle size={20} />
                      <span>Register with Google</span>
                    </button>
                  </form>
                )}

                {regStep === STEP_OTP && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-sm text-gray-500 text-center">
                      We sent a 6-digit OTP to <span className="font-semibold text-gray-700">{regEmail}</span>
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Enter OTP</label>
                      <input type="text" maxLength={6} placeholder="123456" value={regOtp}
                        onChange={e => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        className={inputCls + ' text-center text-xl tracking-widest font-bold'} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
                      Verify OTP
                    </button>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <button type="button" onClick={() => { clearMessages(); setRegStep(STEP_INFO) }} className="hover:underline">
                        ← Change email
                      </button>
                      <button type="button" onClick={handleResendOtp} className="hover:underline">
                        Resend OTP
                      </button>
                    </div>
                  </form>
                )}

                {regStep === STEP_PASS && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                      <input type={showRegPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={regPassword}
                        onChange={e => setRegPassword(e.target.value)} className={inputCls + ' pr-10'} />
                      <button type="button" onClick={() => setShowRegPass(p => !p)}
                        className="absolute right-3 top-[30px] text-gray-400">
                        {showRegPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                      <input type={showRegConfirm ? 'text' : 'password'} placeholder="Repeat password" value={regConfirm}
                        onChange={e => setRegConfirm(e.target.value)} className={inputCls + ' pr-10'} />
                      <button type="button" onClick={() => setShowRegConfirm(p => !p)}
                        className="absolute right-3 top-[30px] text-gray-400">
                        {showRegConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                      </button>
                    </div>
                    <button type="submit" disabled={loading}
                      className="primary-btn w-full py-2.5 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-60">
                      Create Account
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-stone-950 to-gray-800 py-10 md:py-16 order-1 md:order-2">
          <div className="w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gray-900/40 rounded-2xl shadow-xl overflow-hidden border"
            style={{ borderColor: PRIMARY_COLOR }}>
            <img src={imageSrc} alt="AI Assistant" className="w-full h-full object-cover opacity-85" />
          </div>
          <div className="mt-4 md:mt-8 lg:mt-10 px-4">
            <h3 className="text-white text-sm sm:text-lg font-bold tracking-wide text-center px-4 py-2 rounded-lg"
              style={{ backgroundColor: `${PRIMARY_COLOR}CC` }}>
              Chat with your documents, instantly
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login