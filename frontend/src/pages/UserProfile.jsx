
// import React, { useState } from 'react'
// import { ArrowLeft, Camera, Lock, Save } from 'lucide-react'

// const UserProfile = ({ onBack, theme }) => {
//   const [profileImage, setProfileImage] = useState(null)
//   const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

//   const PRIMARY_COLOR = theme === 'light' ? '#4F1C51' : '#E1BEE7'
//   const BG_COLOR = theme === 'light' ? '#FFFFFF' : '#1E1E1E'
//   const TEXT_COLOR = theme === 'light' ? '#000000' : '#FFFFFF'

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (event) => setProfileImage(event.target.result)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleChangePassword = (e) => {
//     e.preventDefault()
//     if (passwords.new !== passwords.confirm) return alert('New passwords do not match.')
//     alert('Password updated successfully (mock).')
//   }

//   return (
//     <div
//       className="flex flex-col items-center justify-center min-h-screen w-full p-6 relative"
//       style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}
//     >
//       <button
//         onClick={onBack}
//         className="absolute top-6 left-6 flex items-center hover:opacity-80 transition"
//         style={{ color: PRIMARY_COLOR }}
//       >
//         <ArrowLeft size={22} className="mr-1" />
//         <span className="font-medium">Back</span>
//       </button>

//       <div
//         className="w-full max-w-md rounded-2xl shadow-lg p-6 border"
//         style={{ borderColor: PRIMARY_COLOR, backgroundColor: theme === 'light' ? '#FFF' : '#2C2C2C' }}
//       >
//         <h2 className="text-center text-2xl font-bold mb-6" style={{ color: PRIMARY_COLOR }}>
//           My Profile
//         </h2>

//         <div className="flex flex-col items-center mb-8">
//           <div className="relative">
//             <img
//               src={profileImage || 'https://via.placeholder.com/120'}
//               alt="Profile"
//               className="w-28 h-28 rounded-full object-cover border-2"
//               style={{ borderColor: PRIMARY_COLOR }}
//             />
//             <label
//               htmlFor="profile-upload"
//               className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow-sm cursor-pointer hover:bg-gray-100 transition"
//               style={{ borderColor: PRIMARY_COLOR }}
//             >
//               <Camera size={18} style={{ color: PRIMARY_COLOR }} />
//             </label>
//             <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
//           </div>
//           <p className="mt-3 font-semibold">John Doe</p>
//           <p className="text-sm opacity-75">john.doe@example.com</p>
//         </div>

//         <form onSubmit={handleChangePassword}>
//           <div className="space-y-4">
//             {['current', 'new', 'confirm'].map((field, i) => (
//               <div key={i}>
//                 <label className="block text-sm font-medium mb-1">
//                   {field === 'current'
//                     ? 'Current Password'
//                     : field === 'new'
//                     ? 'New Password'
//                     : 'Confirm Password'}
//                 </label>
//                 <div
//                   className="flex items-center border rounded-lg px-3 py-2"
//                   style={{ borderColor: PRIMARY_COLOR, backgroundColor: theme === 'light' ? '#FFF' : '#444' }}
//                 >
//                   <Lock size={18} style={{ color: PRIMARY_COLOR }} className="mr-2" />
//                   <input
//                     type="password"
//                     className="flex-1 focus:outline-none bg-transparent"
//                     placeholder={`Enter ${field} password`}
//                     value={passwords[field]}
//                     onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
//                     style={{ color: TEXT_COLOR }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-6 flex items-center justify-center gap-2 text-white font-semibold py-2 rounded-full shadow-md transition hover:opacity-90"
//             style={{ backgroundColor: PRIMARY_COLOR }}
//           >
//             <Save size={18} /> Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default UserProfile


import React from 'react'
import { ArrowLeft } from 'lucide-react'

const UserProfile = ({ onBack, theme }) => {
  const PRIMARY_COLOR = theme === 'light' ? '#4F1C51' : '#E1BEE7'
  const BG_COLOR = theme === 'light' ? '#FFFFFF' : '#1E1E1E'
  const TEXT_COLOR = theme === 'light' ? '#000000' : '#FFFFFF'

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full p-6 relative"
      style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}
    >
      {/* Back Button (WORKING) */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center hover:opacity-80 transition"
        style={{ color: PRIMARY_COLOR }}
      >
        <ArrowLeft size={22} className="mr-1" />
        <span className="font-medium">Back</span>
      </button>

      {/* Coming Soon UI */}
      <div className="text-center">
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: PRIMARY_COLOR }}
        >
          🚧 Coming Soon
        </h1>
        <p className="opacity-75">
          Profile management is under development.
        </p>
      </div>

      {/*
      =====================================================
      EXISTING PROFILE CODE (COMMENTED – DO NOT DELETE)
      =====================================================

      <div
        className="w-full max-w-md rounded-2xl shadow-lg p-6 border"
        style={{ borderColor: PRIMARY_COLOR, backgroundColor: theme === 'light' ? '#FFF' : '#2C2C2C' }}
      >
        <h2 className="text-center text-2xl font-bold mb-6" style={{ color: PRIMARY_COLOR }}>
          My Profile
        </h2>

        ... ENTIRE OLD PROFILE UI HERE ...

      </div>

      =====================================================
      */}
    </div>
  )
}

export default UserProfile

