'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] to-[#203a43] dark:bg-gray-900 px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-white mb-6 text-center"
      >
        Dashboard
      </motion.h1>

      <p className="text-center text-gray-300 mb-10">
        Welcome to your stock manager dashboard. Here you’ll be able to view stock, track sales, predict restocks, and more.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Overview */}
        <Link href="/inventory">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cursor-pointer p-6 bg-gradient-to-r from-blue-500 to-blue-700 dark:bg-blue-800 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            <h2 className="font-semibold text-xl text-white mb-2">Inventory Overview</h2>
            <p className="text-white">Check your current stock levels.</p>
          </motion.div>
        </Link>

        {/* Restock Predictions */}
<Link href="/restock">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="cursor-pointer p-6 bg-gradient-to-r from-green-500 to-green-700 dark:bg-green-800 rounded-xl shadow-lg hover:scale-105 transition-all"
  >
    <h2 className="font-semibold text-xl text-white mb-2">Restock Predictions</h2>
    <p className="text-white">View restock alerts and predictions.</p>
  </motion.div>
</Link>


        {/* Earnings Tracker */}
        <Link href="/earnings">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="cursor-pointer p-6 bg-gradient-to-r from-yellow-500 to-yellow-700 dark:bg-yellow-800 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            <h2 className="font-semibold text-xl text-white mb-2">Earnings Tracker</h2>
            <p className="text-white">Analyze your product earnings.</p>
          </motion.div>
        </Link>
      </div>
    </main>
  );
}
