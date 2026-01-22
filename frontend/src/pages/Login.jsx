
// import imageSrc from '../assets/images/AIchatBot.jpg'
// import { useNavigate } from 'react-router-dom'
// import  Loader from '../components/Loader.jsx'
// // Firebase
// import { auth, provider } from '../firebase'
// import { signInWithPopup } from 'firebase/auth'

// // API
// import { firebaseLoginApi } from '../api/authApi'

// // Zustand store
// import useAuthStore from '../store/useAuthStore'

// // Google icon
// import { FcGoogle } from 'react-icons/fc'

// const PRIMARY_COLOR = '#4F1C51'
// const SHADOW_RGB = '79, 28, 81'

// const Login = () => {
//   const { setUser, setLoading } = useAuthStore()
//   const navigate = useNavigate()

//   const handleGoogleSignIn = async () => {
//     try {
//       setLoading(true)

//       const result = await signInWithPopup(auth, provider)
//       const idToken = await result.user.getIdToken()

//       const res = await firebaseLoginApi({ idToken })

//       localStorage.setItem('token', res.token)
//       localStorage.setItem('user', JSON.stringify(res.user))
// localStorage.removeItem('activeChat')

//       setUser(
//         {
//           _id: res.user._id,
//           name: res.user.name,
//           email: res.user.email,
//           photo: res.user.photoUrl,
//         },
//         res.token
//       )

//       navigate('/chat')
//     } catch (error) {
//       console.error('Google Sign-In Error:', error)
//       alert(error.response?.data?.message || 'Failed to sign in with Google.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-stone-950 to-gray-800 flex items-center justify-center px-4 sm:px-8 font-sans">

//       <style>{`
//         .google-btn:hover {
//           box-shadow: 0 8px 25px rgba(${SHADOW_RGB}, 0.25);
//           transform: translateY(-1px);
//         }
//       `}</style>

//       <div
//         className="
//           flex flex-col md:flex-row 
//           w-full max-w-5xl 
//           bg-white/10 backdrop-blur-xl 
//           rounded-2xl shadow-2xl 
//           overflow-hidden border
//           md:min-h-[80vh]
//         "
//         style={{ borderColor: PRIMARY_COLOR }}
//       >

//         {/* LEFT */}
//         <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-12 sm:px-10 sm:py-16 md:py-24 order-2 md:order-1">
//           <div className="w-full max-w-sm text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
//               Welcome!
//             </h2>

//             <button
//               onClick={handleGoogleSignIn}
//               className="google-btn w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-all duration-200"
//             >
//               <FcGoogle size={22} />
//               <span>Sign in with Google</span>
//             </button>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-stone-950 to-gray-800 py-10 md:py-16 order-1 md:order-2">

//           {/* IMAGE */}
//           <div
//             className="w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gray-900/40 rounded-2xl shadow-xl overflow-hidden border"
//             style={{ borderColor: PRIMARY_COLOR }}
//           >
//             <img
//               src={imageSrc}
//               alt="AI Assistant"
//               className="w-full h-full object-cover opacity-85"
//             />
//           </div>

//           {/* TEXT — slightly closer to image */}
//           <div className="mt-4 md:mt-8 lg:mt-10 px-4">
//             <h3
//               className="text-white text-sm sm:text-lg font-bold tracking-wide text-center px-4 py-2 rounded-lg"
//               style={{ backgroundColor: `${PRIMARY_COLOR}CC` }}
//             >
//               Chat with your documents, instantly
//             </h3>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login

import imageSrc from '../assets/images/AIchatBot.jpg'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader.jsx'

// Firebase
import { auth, provider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'

// API
import { firebaseLoginApi } from '../api/authApi'

// Zustand store
import useAuthStore from '../store/useAuthStore'

// Google icon
import { FcGoogle } from 'react-icons/fc'

const PRIMARY_COLOR = '#4F1C51'
const SHADOW_RGB = '79, 28, 81'

const Login = () => {
  const { setUser, setLoading, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)

      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      const res = await firebaseLoginApi({ idToken })

      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.removeItem('activeChat')

      setUser(
        {
          _id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          photo: res.user.photoUrl,
        },
        res.token
      )

      navigate('/chat')
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      alert(error.response?.data?.message || 'Failed to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-stone-950 to-gray-800 flex items-center justify-center px-4 sm:px-8 font-sans">

      {/* FULL PAGE LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      <style>{`
        .google-btn:hover {
          box-shadow: 0 8px 25px rgba(${SHADOW_RGB}, 0.25);
          transform: translateY(-1px);
        }
      `}</style>

      <div
        className="
          flex flex-col md:flex-row 
          w-full max-w-5xl 
          bg-white/10 backdrop-blur-xl 
          rounded-2xl shadow-2xl 
          overflow-hidden border
          md:min-h-[80vh]
        "
        style={{ borderColor: PRIMARY_COLOR }}
      >

        {/* LEFT */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-12 sm:px-10 sm:py-16 md:py-24 order-2 md:order-1">
          <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
              Welcome!
            </h2>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`google-btn w-full flex items-center justify-center gap-3 
                bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium 
                transition-all duration-200
                ${loading ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              <FcGoogle size={22} />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-stone-950 to-gray-800 py-10 md:py-16 order-1 md:order-2">

          {/* IMAGE */}
          <div
            className="w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gray-900/40 rounded-2xl shadow-xl overflow-hidden border"
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <img
              src={imageSrc}
              alt="AI Assistant"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

          {/* TEXT */}
          <div className="mt-4 md:mt-8 lg:mt-10 px-4">
            <h3
              className="text-white text-sm sm:text-lg font-bold tracking-wide text-center px-4 py-2 rounded-lg"
              style={{ backgroundColor: `${PRIMARY_COLOR}CC` }}
            >
              Chat with your documents, instantly
            </h3>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
