// /api/low-stock/route.ts
import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  const lowStockItems = await prisma.item.findMany({
    where: {
      quantity: {
        lt: 5 // or use restockThreshold
      }
    },
    include: {
      category: true
    }
  })

  return NextResponse.json(lowStockItems)
}
