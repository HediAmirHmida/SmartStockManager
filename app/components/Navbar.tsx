'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-gray-800 shadow-lg px-6 py-4 flex justify-between items-center relative">
      <Link href="/dashboard" className="text-xl font-bold text-white hover:text-blue-400 transition-all">
        Smart Stock Manager
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/inventory" className="text-gray-300 hover:text-white transition-all">Inventory</Link>
        <Link href="/earnings" className="text-gray-300 hover:text-white transition-all">Earnings</Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(prev => !prev)}
            className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-all"
          >
            <span className="text-white font-semibold">U</span>
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                 onClick={async () => {
                  setDropdownOpen(false);
                  try {
                    const res = await fetch('/api/auth/logout');
                    if (res.ok) {
                      window.location.href = "/login"; // redirect to login
                    } else {
                      alert("Logout failed.");
                    }
                  } catch (error) {
                    console.error("Logout error:", error);
                    alert("An error occurred during logout.");
                  }
                }}
                
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
