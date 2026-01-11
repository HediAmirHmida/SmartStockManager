'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { TrendingUp, Filter, Euro, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

const COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA']

interface Category {
  id: number;
  name: string;
}

interface EarningsEntry {
  _sum: {
    total: number;
  };
  name?: string;
  categoryId?: number;
}

interface ByDateEntry {
  date: string;
  total: number;
  categoryId?: number;
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsEntry[]>([])
  const [byDate, setByDate] = useState<ByDateEntry[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all')
  const [viewMode, setViewMode] = useState<'product' | 'category'>('product')

  useEffect(() => {
    fetch('/api/sale?type=summary')
      .then((res) => res.json())
      .then(setEarnings)

    fetch('/api/sale?type=by-date')
      .then((res) => res.json())
      .then(setByDate)

    fetch('/api/category') // Make sure this route exists
      .then((res) => res.json())
      .then(setCategories)
  }, [])

  // Filter earnings by selected category if applicable
  const filteredEarnings = selectedCategoryId === 'all'
  ? earnings
  : earnings.filter((e: any) => e.categoryId === selectedCategoryId)

  const earningsOverTime = selectedCategoryId === 'all'
  ? byDate
  : byDate.filter((entry: any) => entry.categoryId === selectedCategoryId)

  // Calculate total earnings
  const totalEarnings = filteredEarnings.reduce((sum: number, e: any) => sum + (e._sum?.total || 0), 0)

  // Process data for better insights
  const processedEarnings = filteredEarnings
    .map((item: any) => ({
      ...item,
      percentage: totalEarnings > 0 ? ((item._sum.total / totalEarnings) * 100) : 0
    }))
    .sort((a: any, b: any) => b._sum.total - a._sum.total) // Sort by earnings descending
    .slice(0, 10) // Show top 10

  const topPerformer = processedEarnings[0]
  const totalItems = processedEarnings.length
  const avgEarnings = totalEarnings / Math.max(totalItems, 1)

  // Enhanced color scheme
  const GRADIENT_COLORS = [
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#F59E0B', // amber
    '#EF4444', // red
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#EC4899', // pink
    '#6B7280'  // gray
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] to-[#203a43] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-yellow-400" />
            Earnings Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Analyze your revenue and sales performance</p>
        </motion.div>

        {/* Total Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
              <p className="text-4xl font-bold text-yellow-300">€{totalEarnings.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-xl">
              <Euro className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center justify-center mb-8 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'product' | 'category')}
              className="bg-white/50 border border-white/20 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="product">View by Product</option>
              <option value="category">View by Category</option>
            </select>
          </div>

          {(viewMode === 'category' || selectedCategoryId !== 'all') && (
            <select
              value={selectedCategoryId}
              onChange={(e) =>
                setSelectedCategoryId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
              }
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Top Earner</p>
                <p className="text-white text-lg font-bold">
                  {topPerformer ? `€${topPerformer._sum.total.toFixed(0)}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Avg per Item</p>
                <p className="text-white text-lg font-bold">€{avgEarnings.toFixed(0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Items</p>
                <p className="text-white text-lg font-bold">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Euro className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Revenue</p>
                <p className="text-white text-lg font-bold">€{totalEarnings.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Enhanced Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold">Top {processedEarnings.length} Earners</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Items</p>
                <p className="text-lg font-bold text-green-400">{totalItems}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={processedEarnings} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                <XAxis 
                  dataKey="itemName" 
                  stroke="#ccc" 
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="#ccc" 
                  fontSize={11}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    <div key="value" className="text-center">
                      <div className="text-lg font-bold text-green-400">€{value.toFixed(2)}</div>
                      <div className="text-sm text-gray-300">{props.payload.percentage.toFixed(1)}% of total</div>
                    </div>,
                    'Earnings'
                  ]}
                  labelFormatter={(label) => <span className="font-semibold">{label}</span>}
                />
                <Bar 
                  dataKey="_sum.total" 
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  stroke="#10B981"
                  strokeWidth={1}
                >
                  {processedEarnings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {topPerformer && (
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-green-300">
                  🏆 <strong>{topPerformer.itemName}</strong> leads with €{topPerformer._sum.total.toFixed(2)} 
                  ({topPerformer.percentage.toFixed(1)}% of total earnings)
                </p>
              </div>
            )}
          </motion.div>

          {/* Enhanced Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">Revenue Distribution</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Avg per Item</p>
                <p className="text-lg font-bold text-purple-400">€{avgEarnings.toFixed(0)}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={processedEarnings}
                  dataKey="_sum.total"
                  nameKey="itemName"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ percentage }) => percentage > 5 ? `${percentage.toFixed(0)}%` : ''}
                  labelLine={false}
                >
                  {processedEarnings.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    <div key="value" className="text-center">
                      <div className="text-lg font-bold text-purple-400">€{value.toFixed(2)}</div>
                      <div className="text-sm text-gray-300">{props.payload.percentage.toFixed(1)}% share</div>
                    </div>,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <p className="text-sm text-gray-400">Top Contributor</p>
                <p className="text-lg font-bold text-purple-400">
                  {topPerformer ? `${topPerformer.percentage.toFixed(0)}%` : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-gray-400">Items Count</p>
                <p className="text-lg font-bold text-blue-400">{totalItems}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold">
                Revenue Trends {selectedCategoryId !== 'all' ? ' (Filtered)' : ''}
              </h2>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Data Points</p>
                <p className="text-lg font-bold text-blue-400">{earningsOverTime.length}</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={earningsOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.2}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid stroke="#444" strokeDasharray="5 5" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#ccc" 
                fontSize={11}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="#ccc" 
                fontSize={11}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
                formatter={(value: number) => [
                  <div key="value" className="text-center">
                    <div className="text-lg font-bold text-blue-400">€{value.toFixed(2)}</div>
                  </div>,
                  'Daily Earnings'
                ]}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="url(#lineGradient)"
                strokeWidth={4}
                dot={{ fill: '#3B82F6', r: 5, filter: 'url(#glow)' }}
                activeDot={{ r: 8, fill: '#1D4ED8', filter: 'url(#glow)' }}
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Trend Analysis */}
          {earningsOverTime.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                <p className="text-sm text-gray-400">Latest Day</p>
                <p className="text-lg font-bold text-blue-400">
                  €{earningsOverTime[earningsOverTime.length - 1]?.total?.toFixed(0) || '0'}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg text-center">
                <p className="text-sm text-gray-400">7-Day Avg</p>
                <p className="text-lg font-bold text-green-400">
                  €{(earningsOverTime.slice(-7).reduce((sum, day) => sum + (day.total || 0), 0) / Math.min(7, earningsOverTime.length)).toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg text-center">
                <p className="text-sm text-gray-400">Trend</p>
                <p className="text-lg font-bold text-purple-400">
                  {earningsOverTime.length >= 2 ? 
                    ((earningsOverTime[earningsOverTime.length - 1]?.total || 0) > (earningsOverTime[earningsOverTime.length - 2]?.total || 0) ? '↗️ Up' : '↘️ Down')
                    : '➡️ New'
                  }
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
