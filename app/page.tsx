'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#0f172a] to-[#1e293b] dark:from-[#0f172a] dark:to-[#0f172a] text-white">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Smart Stock Manager
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Visualize your inventory, predict restocks, and monitor your earnings – all in one place.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 text-lg font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300 shadow-md"
        >
          Get Started
        </Link>
      </motion.div>

      {/* Feature Cards */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "Real-time Inventory",
            desc: "See what’s in stock and what’s running low instantly.",
          },
          {
            title: "Smart Restocking",
            desc: "Let the app help you decide when to reorder products.",
          },
          {
            title: "Track Profits",
            desc: "Keep an eye on sales and earnings in one clean view.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i, duration: 0.6 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
