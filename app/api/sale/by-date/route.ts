// /api/sale/by-date/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        item: {
          select: {
            categoryId: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      }
    })

    const grouped: Record<string, Record<number, number>> = {}

    sales.forEach((sale) => {
      const date = sale.createdAt.toISOString().split('T')[0]
      const categoryId = sale.item.categoryId

      if (!grouped[date]) grouped[date] = {}
      if (!grouped[date][categoryId]) grouped[date][categoryId] = 0

      grouped[date][categoryId] += sale.total
    })

    const result = Object.entries(grouped).flatMap(([date, categoryTotals]) =>
      Object.entries(categoryTotals).map(([categoryId, total]) => ({
        date,
        categoryId: parseInt(categoryId),
        total,
      }))
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('[GET /api/sale/by-date]', error)
    return new NextResponse('Failed to load sale data by date', { status: 500 })
  }
}
