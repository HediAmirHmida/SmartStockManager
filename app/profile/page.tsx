'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false) // To toggle edit mode

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

    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (res.ok) {
      setMessage('Profile updated successfully!')
      setPassword('') // Clear password field
      setIsEditing(false) // Switch off editing mode
    } else {
      setMessage('Failed to update profile')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Edit Profile</h1>

        <div className="space-y-6">
          {/* Display profile information */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-300">Name: {name || 'Not provided'}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-300">Email: {email || 'Not provided'}</p>
              </div>
              {/* Optional: Show password field if needed */}
            </div>
          ) : (
            // Profile editing form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Change Password (optional)</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 mt-4 text-center"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </main>
  )
}
