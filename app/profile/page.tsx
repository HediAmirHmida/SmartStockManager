'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Edit2, Save, X } from 'lucide-react'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          console.error('Failed to fetch profile');
          return;
        }
        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [])

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!name.trim()) {
      setMessage('Name cannot be empty')
      return
    }

    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password: password.trim() || undefined }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage('Profile updated successfully!')
      setPassword('')
      setIsEditing(false)
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(data.error || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    // Reset to original values
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setName(data.name)
        setEmail(data.email)
      })
    setPassword('')
    setIsEditing(false)
    setMessage('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] px-6 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center mb-10"
        >
          My Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{name || 'User'}</h2>
                    <p className="text-gray-300 text-sm">Profile Information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <label className="text-gray-400 text-sm font-medium">Name</label>
                  </div>
                  <p className="text-white text-lg">{name || 'Not provided'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <label className="text-gray-400 text-sm font-medium">Email</label>
                  </div>
                  <p className="text-white text-lg">{email || 'Not provided'}</p>
                  <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
                <p className="text-gray-300 text-sm">Update your name and password. Email cannot be changed.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="flex items-center gap-2 text-gray-300 mb-3">
                  <User className="w-5 h-5 text-blue-400" />
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="flex items-center gap-2 text-gray-300 mb-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
                  value={email}
                />
                <p className="text-gray-400 text-xs mt-2">Email is read-only and cannot be changed</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="flex items-center gap-2 text-gray-300 mb-3">
                  <Lock className="w-5 h-5 text-blue-400" />
                  New Password (optional)
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Leave empty to keep current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-gray-400 text-xs mt-2">Only enter a new password if you want to change it</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-all hover:scale-105"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg text-center ${
                message.includes('success') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/50'
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </main>
  )
}
