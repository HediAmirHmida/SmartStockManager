// /api/low-stock/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'
import { requireAuth } from '../../lib/auth'

export async function GET() {
  try {
    const user = await requireAuth();

    // Get items with low quantity (traditional low stock)
    const lowQuantityItems = await prisma.item.findMany({
      where: {
        userId: user.id,
        quantity: {
          lt: 10 // Increased threshold
        }
      },
      include: {
        category: true,
        sales: true
      }
    })

    // Get items that will run out soon based on sales predictions
    const allItems = await prisma.item.findMany({
      where: { userId: user.id },
      include: {
        category: true,
        sales: true
      }
    })

    const itemsRunningOutSoon = allItems
      .filter(item => {
        if (item.quantity < 10) return false; // Already included above

        const sales = item.sales
        const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0)
        const days = Math.max(7, new Set(sales.map(s => s.createdAt.toISOString().split('T')[0])).size || 1)
        const dailyRate = totalSold / days

        if (dailyRate <= 0) return false

        const daysUntilOut = Math.floor(item.quantity / dailyRate)
        return daysUntilOut <= 7 // Will run out in 7 days or less
      })
      .map(item => ({
        ...item,
        reason: 'running_out_soon'
      }))

    // Combine both lists and remove duplicates
    const combinedItems = [...lowQuantityItems, ...itemsRunningOutSoon]
    const uniqueItems = combinedItems.filter((item, index, self) =>
      index === self.findIndex(i => i.id === item.id)
    )

    return NextResponse.json(uniqueItems)
  } catch (error) {
    console.error('Error fetching low stock:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}
