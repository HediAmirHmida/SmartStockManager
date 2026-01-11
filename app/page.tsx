'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, TrendingUp, BarChart3, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Real-time Inventory",
      desc: "See what's in stock and what's running low instantly with live updates.",
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      delay: 0.2,
    },
    {
      title: "Smart Restocking",
      desc: "AI-powered predictions help you decide when to reorder products before stockouts.",
      icon: Zap,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      delay: 0.4,
    },
    {
      title: "Track Profits",
      desc: "Keep an eye on sales and earnings in one clean, comprehensive dashboard.",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      delay: 0.6,
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "10k+", label: "Items Tracked" },
    { value: "50%", label: "Time Saved" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Smart Inventory Management</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Smart Stock
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Manager
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Visualize your inventory, predict restocks, and monitor your earnings – all in one powerful platform.
            <span className="text-blue-400 font-semibold"> Boost efficiency by 50%</span> with AI-driven insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              View Demo
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Everything you need to manage your inventory efficiently and grow your business.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: feature.delay, duration: 0.6 }}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-24"
        >
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
            <Shield className="w-16 h-16 mx-auto mb-6 text-green-400" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Inventory Management?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Smart Stock Manager to streamline their operations.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-4 text-xl font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started for Free
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
