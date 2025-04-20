// /api/restock-prediction/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  const items = await prisma.item.findMany({
    include: { sales: true }
  })

  const predictions = items.map((item) => {
    const sales = item.sales
    const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0)
    const days = new Set(sales.map(s => s.createdAt.toISOString().split('T')[0])).size || 1
    const dailyRate = totalSold / days

    const daysUntilOut = dailyRate > 0 ? Math.floor(item.quantity / dailyRate) : null
    const estimatedRestockDate = daysUntilOut
      ? new Date(Date.now() + daysUntilOut * 86400000).toISOString().split('T')[0]
      : null

    return {
      itemId: item.id,
      itemName: item.name,
      quantity: item.quantity,
      dailyRate: dailyRate.toFixed(2),
      daysUntilOut,
      estimatedRestockDate
    }
  })

  return NextResponse.json(predictions)
}
