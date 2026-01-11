'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign, ArrowRight, BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalItems: number;
  lowStockCount: number;
  totalEarnings: number;
  restockAlerts: number;
  totalCategories: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lowStockCount: 0,
    totalEarnings: 0,
    restockAlerts: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [categoriesRes, lowStockRes, earningsRes, predictionsRes] = await Promise.all([
          fetch('/api/category'),
          fetch('/api/low-stock'),
          fetch('/api/sale?type=summary'),
          fetch('/api/restock-prediction'),
        ]);

        const categories = await categoriesRes.json();
        const lowStock = await lowStockRes.json();
        const earnings = await earningsRes.json();
        const predictions = await predictionsRes.json();

        // Calculate stats
        const totalItems = categories.reduce((sum: number, cat: any) => sum + cat.items.length, 0);
        const totalEarnings = earnings.reduce((sum: number, e: any) => sum + (e._sum.total || 0), 0);
        const restockAlerts = predictions.filter((p: any) => p.daysUntilOut !== null && p.daysUntilOut <= 7).length;

        setStats({
          totalItems,
          lowStockCount: lowStock.length,
          totalEarnings,
          restockAlerts,
          totalCategories: categories.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Inventory Overview',
      description: 'Manage your stock levels',
      href: '/inventory',
      icon: Package,
      gradient: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      stat: stats.totalItems,
      statLabel: 'Total Items',
      subStat: `${stats.totalCategories} Categories`,
    },
    {
      title: 'Restock Predictions',
      description: 'Smart restock alerts',
      href: '/restock',
      icon: AlertTriangle,
      gradient: 'from-green-500 to-green-700',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      stat: stats.restockAlerts,
      statLabel: 'Urgent Alerts',
      subStat: `${stats.lowStockCount} Low Stock`,
    },
    {
      title: 'Earnings Tracker',
      description: 'Analyze revenue & sales',
      href: '/earnings',
      icon: TrendingUp,
      gradient: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      stat: `$${stats.totalEarnings.toFixed(2)}`,
      statLabel: 'Total Earnings',
      subStat: 'All time revenue',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] to-[#203a43] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-300 text-lg"
          >
            Welcome to your stock manager. Monitor inventory, track earnings, and optimize restocking.
          </motion.p>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Items</p>
                <p className="text-white text-xl font-bold">{loading ? '...' : stats.totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Low Stock</p>
                <p className="text-white text-xl font-bold">{loading ? '...' : stats.lowStockCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Categories</p>
                <p className="text-white text-xl font-bold">{loading ? '...' : stats.totalCategories}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Revenue</p>
                <p className="text-white text-xl font-bold">
                  {loading ? '...' : `$${stats.totalEarnings.toFixed(0)}`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Icon and Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 ${card.bgColor} rounded-xl`}>
                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Title and Description */}
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-6 group-hover:text-gray-300 transition-colors">
                      {card.description}
                    </p>

                    {/* Stats */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-white">
                          {loading ? '...' : card.stat}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{card.statLabel}</p>
                      <p className="text-gray-500 text-xs mt-1">{card.subStat}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
