import { useState, useRef } from 'react'
import { ArrowLeft, Camera, Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const PRIMARY_COLOR = '#4F1C51'

const UserProfile = ({ onBack, theme }) => {
  const { user, token, setUser } = useAuthStore()

  const BG_COLOR   = theme === 'light' ? '#FFFFFF' : '#1E1E1E'
  const TEXT_COLOR = theme === 'light' ? '#111111' : '#F5F5F5'
  const CARD_BG    = theme === 'light' ? '#FFFFFF' : '#2C2C2C'
  const INPUT_BG   = theme === 'light' ? '#F9F5FA' : '#3A3A3A'
  const BORDER     = theme === 'light' ? '#E0D0E1' : '#555'

  const fileInputRef = useRef(null)

  // ── Photo state ────────────────────────────────────────────────────────────
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile]       = useState(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoSuccess, setPhotoSuccess] = useState(false)
  const [photoError, setPhotoError]     = useState('')

  // ── Password state ─────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent]         = useState(false)
  const [showNew, setShowNew]                 = useState(false)
  const [showConfirm, setShowConfirm]         = useState(false)
  const [passLoading, setPassLoading]         = useState(false)
  const [passSuccess, setPassSuccess]         = useState(false)
  const [passError, setPassError]             = useState('')

  const isEmailUser = user?.authProvider === 'email' || 
                      (typeof user === 'object' && !user?.authProvider?.includes('google'))

  // ── Handle photo file select (preview only) ────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setPhotoSuccess(false)
    setPhotoError('')
  }

  // ── Upload photo to backend ────────────────────────────────────────────────
  const handlePhotoUpload = async () => {
    if (!photoFile) return
    setPhotoLoading(true)
    setPhotoError('')
    setPhotoSuccess(false)
    try {
      const formData = new FormData()
      formData.append('photo', photoFile)

      const res = await axios.post(`${API_BASE}/api/profile/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      // Update zustand + localStorage
      const updatedUser = { ...user, photo: res.data.photoUrl, photoUrl: res.data.photoUrl }
      setUser(updatedUser, token)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setPhotoSuccess(true)
      setPhotoPreview(null)
      setPhotoFile(null)
    } catch (err) {
      setPhotoError(err.response?.data?.message || 'Photo upload failed.')
    } finally {
      setPhotoLoading(false)
    }
  }

  // ── Update password ────────────────────────────────────────────────────────
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess(false)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.')
      return
    }
    try {
      setPassLoading(true)
      await axios.put(
        `${API_BASE}/api/profile/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPassSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPassError(err.response?.data?.message || 'Password update failed.')
    } finally {
      setPassLoading(false)
    }
  }

  const currentPhoto = photoPreview || user?.photo || user?.photoUrl

  const inputStyle = {
    backgroundColor: INPUT_BG,
    color: TEXT_COLOR,
    borderColor: BORDER,
  }

  return (
    <div
      className="flex flex-col items-center min-h-screen w-full p-6 relative"
      style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1 hover:opacity-75 transition"
        style={{ color: PRIMARY_COLOR }}
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="w-full max-w-md mt-16 space-y-6">

        {/* ── Card: Profile Picture ──────────────────────────────────────── */}
        <div
          className="rounded-2xl shadow-md p-6 border"
          style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: PRIMARY_COLOR }}>
            Profile Picture
          </h2>

          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-200"
                style={{ borderColor: PRIMARY_COLOR }}
              >
                {currentPhoto ? (
                  <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold" style={{ color: PRIMARY_COLOR }}>
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <Camera size={14} color="white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* User info */}
            <div className="text-center">
              <p className="font-semibold text-base">{user?.name}</p>
              <p className="text-sm opacity-60">{user?.email}</p>
              <span
                className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${PRIMARY_COLOR}22`, color: PRIMARY_COLOR }}
              >
                {user?.authProvider === 'google' ? '🔵 Google Account' : '📧 Email Account'}
              </span>
            </div>

            {/* Preview banner + upload button */}
            {photoFile && (
              <div className="w-full space-y-2">
                <p className="text-xs text-center opacity-60">
                  Preview ready — click Save to upload
                </p>
                <button
                  onClick={handlePhotoUpload}
                  disabled={photoLoading}
                  className="w-full py-2 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  {photoLoading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save size={15} />
                  )}
                  {photoLoading ? 'Uploading...' : 'Save Photo'}
                </button>
              </div>
            )}

            {photoSuccess && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle size={15} /> Profile picture updated!
              </div>
            )}
            {photoError && (
              <p className="text-red-500 text-xs text-center">{photoError}</p>
            )}
          </div>
        </div>

        {/* ── Card: Change Password (email users only) ───────────────────── */}
        {isEmailUser && (
          <div
            className="rounded-2xl shadow-md p-6 border"
            style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
          >
            <h2 className="text-lg font-bold mb-5" style={{ color: PRIMARY_COLOR }}>
              Change Password
            </h2>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">

              {/* Current Password */}
              <div>
                <label className="block text-xs font-medium mb-1 opacity-70">Current Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={14} style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full pl-8 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none"
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowCurrent(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium mb-1 opacity-70">New Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={14} style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-8 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none"
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium mb-1 opacity-70">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={14} style={{ color: PRIMARY_COLOR }} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-8 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none"
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {passError && (
                <p className="text-red-500 text-xs">{passError}</p>
              )}
              {passSuccess && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle size={15} /> Password updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {passLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Save size={15} />
                )}
                {passLoading ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Google users — info note */}
        {!isEmailUser && (
          <div
            className="rounded-2xl p-4 border text-sm text-center opacity-70"
            style={{ borderColor: BORDER, backgroundColor: CARD_BG }}
          >
            🔵 Your account uses Google Sign-In. Password management is handled by Google.
          </div>
        )}

      </div>
    </div>
  )
}

export default UserProfile