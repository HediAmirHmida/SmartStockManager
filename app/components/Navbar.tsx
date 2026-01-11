'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, TrendingUp, User, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/earnings', label: 'Earnings', icon: TrendingUp },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-[#0f2027]/80 to-[#203a43]/80 backdrop-blur-lg border-b border-white/10 shadow-lg">

      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link 
          href="/dashboard" 
          className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent hover:from-blue-300 hover:to-blue-500 transition-all"
        >
          Smart Stock Manager
        </Link>

        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(link.href)
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            )
          })}

          {/* Profile Dropdown */}
          <div className="relative ml-4" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen(prev => !prev)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center cursor-pointer hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg"
            >
              <User className="w-5 h-5 text-white" />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <div className="h-px bg-white/10" />
                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      try {
                        const res = await fetch('/api/auth/logout');
                        if (res.ok) {
                          window.location.href = "/login";
                        } else {
                          alert("Logout failed.");
                        }
                      } catch (error) {
                        console.error("Logout error:", error);
                        alert("An error occurred during logout.");
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  )
}
