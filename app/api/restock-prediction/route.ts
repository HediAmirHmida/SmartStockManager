// /api/restock-prediction/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'
import { requireAuth } from '../../lib/auth'

export async function GET() {
  try {
    const user = await requireAuth();

    const items = await prisma.item.findMany({
      where: { userId: user.id },
      include: { sales: true }
    })

    const predictions = items.map((item) => {
      const sales = item.sales
      const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0)

      // Calculate days since first sale or use a minimum of 7 days for more realistic averages
      const firstSaleDate = sales.length > 0 ? Math.min(...sales.map(s => s.createdAt.getTime())) : Date.now()
      const daysSinceFirstSale = Math.max(1, Math.ceil((Date.now() - firstSaleDate) / (1000 * 60 * 60 * 24)))
      const days = Math.max(7, new Set(sales.map(s => s.createdAt.toISOString().split('T')[0])).size || 1) // Minimum 7 days
      const dailyRate = totalSold / days

      const daysUntilOut = dailyRate > 0 ? Math.max(0, Math.floor(item.quantity / dailyRate)) : null
      const estimatedRestockDate = daysUntilOut && daysUntilOut <= 30
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
  } catch (error) {
    console.error('Error fetching restock predictions:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}
