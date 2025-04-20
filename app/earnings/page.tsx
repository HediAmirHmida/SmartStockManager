'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'

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
    fetch('/api/sale/summary')
      .then((res) => res.json())
      .then(setEarnings)

    fetch('/api/sale/by-date')
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
  

  return (
    <div className="min-h-screen p-10 bg-gray-900 text-white space-y-12">
      <h1 className="text-3xl font-bold text-center mb-10">📊 Earnings Dashboard</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-center justify-center mb-6">
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'product' | 'category')}
          className="bg-gray-800 text-white border border-gray-700 p-2 rounded-md"
        >
          <option value="product">View by Product</option>
          <option value="category">View by Category</option>
        </select>

        {viewMode === 'category' || selectedCategoryId !== 'all' ? (
          <select
            value={selectedCategoryId}
            onChange={(e) =>
              setSelectedCategoryId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
            }
            className="bg-gray-800 text-white border border-gray-700 p-2 rounded-md"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        ) : null}
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[400px] bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{chartTitle}</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredEarnings} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="itemName" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="_sum.total" fill="#34D399">
              <LabelList dataKey="_sum.total" position="top" fill="#fff" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[400px] bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Earnings Distribution</h2>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={filteredEarnings}
              dataKey="_sum.total"
              nameKey="itemName"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {filteredEarnings.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart for earnings over time */}
      <div className="w-full h-[400px] bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Earnings Over Time {selectedCategoryId !== 'all' ? ' (Filtered by Category)' : ''}
        </h2>
        <ResponsiveContainer>
          <LineChart data={earningsOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <CartesianGrid stroke="#444" strokeDasharray="5 5" />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#60A5FA" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
