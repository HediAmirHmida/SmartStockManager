// /api/sale/summary/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma';

export async function GET() {
  const summary = await prisma.sale.groupBy({
    by: ['itemId'],
    _sum: {
      total: true,
      quantity: true
    },
    _count: {
      _all: true
    },
    orderBy: {
      _sum: {
        total: 'desc'
      }
    }
  })

  const withDetails = await Promise.all(summary.map(async (entry) => {
    const item = await prisma.item.findUnique({
      where: { id: entry.itemId },
      include: { category: true }
    })
    return {
      ...entry,
      itemName: item?.name || 'Unknown Item',
      categoryId: item?.categoryId || null,
      categoryName: item?.category?.name || 'Unknown Category'
    }
  }))

  return NextResponse.json(withDetails)
}
