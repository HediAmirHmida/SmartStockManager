'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { TrendingUp, Filter, DollarSign, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

const COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA']

interface Category {
  id: number;
  name: string;
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState([])
  const [byDate, setByDate] = useState([])
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


  const chartTitle = viewMode === 'category'
    ? `Total Earnings of Products in Selected Category`
    : `Total Earnings by Product`

    const earningsOverTime = selectedCategoryId === 'all'
    ? byDate
    : byDate.filter((entry: any) => entry.categoryId === selectedCategoryId)
  

  // Calculate total earnings
  const totalEarnings = filteredEarnings.reduce((sum: number, e: any) => sum + (e._sum?.total || 0), 0)

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
              <p className="text-4xl font-bold text-yellow-300">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-yellow-400" />
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold">{chartTitle}</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredEarnings} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="itemName" stroke="#ccc" fontSize={12} />
                <YAxis stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="_sum.total" fill="#34D399" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="_sum.total" position="top" fill="#fff" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Earnings Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={filteredEarnings}
                  dataKey="_sum.total"
                  nameKey="itemName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {filteredEarnings.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Line Chart for earnings over time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">
              Earnings Over Time {selectedCategoryId !== 'all' ? ' (Filtered by Category)' : ''}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={earningsOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <XAxis dataKey="date" stroke="#ccc" fontSize={12} />
              <YAxis stroke="#ccc" />
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#60A5FA" 
                strokeWidth={3}
                dot={{ fill: '#60A5FA', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </main>
  )
}
