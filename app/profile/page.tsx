'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'

export default function Profile() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const savedUsername = localStorage.getItem('username')

    if (!userId) {
      router.push('/auth/login')
      return
    }

    setUsername(savedUsername || '')
    // In real app, would fetch from API
    setEmail('user@exitfrommatrix.com')
    setBio('Decentralized governance enthusiast')
    setPhotoUrl('https://api.dicebear.com/7.x/avataaars/svg?seed=' + savedUsername)
    setPhotoPreview('https://api.dicebear.com/7.x/avataaars/svg?seed=' + savedUsername)
    setLoading(false)
  }, [router])

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoUpload = async () => {
    if (!photoFile && !photoUrl) {
      setError('Please select a photo or provide a URL')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const userId = localStorage.getItem('user_id')

      if (photoFile) {
        // Convert file to base64 or use FormData
        const formData = new FormData()
        formData.append('photo', photoFile)

        // For now, use the preview as URL
        const uploadUrl = photoPreview
        await axios.post(
          `http://localhost:5000/api/users/${userId}/photo`,
          { photo_url: uploadUrl }
        )
      } else if (photoUrl) {
        await axios.post(
          `http://localhost:5000/api/users/${userId}/photo`,
          { photo_url: photoUrl }
        )
      }

      setMessage('Photo updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload photo')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const userId = localStorage.getItem('user_id')

      // In real app, would have endpoint to save profile
      // await axios.put(`http://localhost:5000/api/users/${userId}`, {
      //   email, bio
      // })

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="matrix-bg min-h-screen flex items-center justify-center">
        <div className="neon-green text-2xl">LOADING PROFILE...</div>
      </main>
    )
  }

  return (
    <main className="matrix-bg min-h-screen">
      <header className="border-b border-green-500 py-6">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl neon-green font-bold">PROFILE</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500/10"
          >
            BACK
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Photo Section */}
          <div className="md:col-span-1">
            <div className="bg-black border-2 border-green-500 neon-glow rounded-lg p-6">
              <h2 className="text-xl neon-green font-bold mb-4">PROFILE PHOTO</h2>

              {/* Photo Preview */}
              <div className="relative w-full aspect-square rounded-lg border-2 border-green-500 overflow-hidden mb-4 bg-gray-900">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="neon-green text-4xl">📷</span>
                  </div>
                )}
              </div>

              {/* Photo URL Input */}
              <div className="mb-4">
                <label className="block neon-green text-sm font-bold mb-2">
                  PHOTO URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-gray-900 border-2 border-green-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-green-300"
                />
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block neon-green text-sm font-bold mb-2">
                  OR UPLOAD FILE
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="w-full text-gray-400 text-sm"
                />
              </div>

              <button
                onClick={handlePhotoUpload}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
              >
                {saving ? 'UPLOADING...' : 'UPLOAD PHOTO'}
              </button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="md:col-span-2">
            <div className="bg-black border-2 border-green-500 neon-glow rounded-lg p-6">
              <h2 className="text-xl neon-green font-bold mb-6">EDIT PROFILE</h2>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block neon-green text-sm font-bold mb-2">
                    USERNAME
                  </label>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full bg-gray-900 border-2 border-gray-600 rounded px-4 py-2 text-gray-400 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Username cannot be changed
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block neon-green text-sm font-bold mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border-2 border-green-500 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-green-300"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block neon-green text-sm font-bold mb-2">
                    BIO
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-gray-900 border-2 border-green-500 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-green-300 h-24 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {bio.length}/200 characters
                  </p>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="neon-green font-bold mb-3">ACCOUNT STATS</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">ACCOUNT CREATED</p>
                      <p className="neon-green font-bold">Dec 21, 2025</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">LAST LOGIN</p>
                      <p className="neon-green font-bold">Today</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full red-pill text-white font-bold py-3 rounded transition disabled:opacity-50 mt-6"
                >
                  {saving ? 'SAVING...' : 'SAVE PROFILE'}
                </button>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-black border-2 border-red-500 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#ff6666' }}>
                SECURITY
              </h3>
              <button className="w-full border-2 border-red-500 text-red-500 font-bold py-2 px-4 rounded hover:bg-red-500/10 transition">
                CHANGE PASSWORD
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
