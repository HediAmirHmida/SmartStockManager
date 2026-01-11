'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock } from 'lucide-react';

interface LowStockItem {
  id: number;
  name: string;
  quantity: number;
  category: { name: string };
  reason?: string; // 'low_quantity' or 'running_out_soon'
}

interface Prediction {
  itemId: number;
  itemName: string;
  quantity: number;
  dailyRate: string;
  daysUntilOut: number | null;
  estimatedRestockDate: string | null;
}

export default function RestockPage() {
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    fetch('/api/low-stock')
      .then(res => res.json())
      .then(data => setLowStock(data));

    fetch('/api/restock-prediction')
      .then(res => res.json())
      .then(data => setPredictions(data));
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Restock Alerts & Predictions
      </motion.h1>

      {/* Low Stock Alerts */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="text-yellow-400" /> Stock Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowStock.length === 0 ? (
            <p className="text-gray-300">No low stock items found.</p>
          ) : (
            lowStock.map(item => {
              const isRunningOutSoon = item.reason === 'running_out_soon';
              return (
                <motion.div
                  key={item.id}
                  className={`p-5 rounded-xl shadow-xl hover:scale-105 transition-all ${
                    isRunningOutSoon 
                      ? 'bg-orange-600/80 border-2 border-orange-400' 
                      : 'bg-red-600/80'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    {isRunningOutSoon && (
                      <span className="text-xs bg-orange-500 px-2 py-1 rounded-full font-semibold">
                        ⚠️ Running Out Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm">Category: {item.category.name}</p>
                  <p className="text-sm">Remaining: {item.quantity}</p>
                  {isRunningOutSoon && (
                    <p className="text-xs text-orange-200 mt-2">
                      This item has sufficient quantity but is selling quickly
                    </p>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Restock Predictions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <CalendarClock className="text-teal-300" /> Restock Predictions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.length === 0 ? (
            <p className="text-gray-300">No predictions available.</p>
          ) : (
            predictions.map(p => (
              <motion.div
                key={p.itemId}
                className="bg-teal-700/80 p-5 rounded-xl shadow-xl hover:scale-105 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold">{p.itemName}</h3>
                <p className="text-sm">Current Quantity: {p.quantity}</p>
                <p className="text-sm">Avg. Daily Sales: {p.dailyRate}</p>
                <p className={`text-sm ${p.daysUntilOut === 0 ? 'text-red-300 font-semibold' : ''}`}>
                  Days Until Out: {p.daysUntilOut === 0 ? 'Today' : p.daysUntilOut ?? 'N/A'}
                </p>
                {p.daysUntilOut === 0 && (
                  <p className="text-xs text-red-200">⚠️ Out of stock today based on current sales rate</p>
                )}
                {p.estimatedRestockDate && (
                  <p className="text-sm font-semibold text-yellow-200">
                    ⏳ Estimated Restock Date: {p.estimatedRestockDate}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
