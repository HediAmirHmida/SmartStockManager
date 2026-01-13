import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { requireAuth } from '../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { itemId, quantity, price } = await req.json();

    // Get item to check current quantity (ensure it belongs to user)
    const item = await prisma.item.findFirst({
      where: { id: itemId, userId: user.id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (item.quantity < quantity) {
      return NextResponse.json(
        { error: 'Not enough quantity in stock' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = quantity * price;

    // Create sale and update item quantity in a single transaction
    const [sale] = await prisma.$transaction([
      prisma.sale.create({
        data: { itemId, quantity, price, total, userId: user.id },
      }),
      prisma.item.update({
        where: { id: itemId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      }),
    ]);

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'summary') {
      // Return summary grouped by item (user-specific)
      const summary = await prisma.sale.groupBy({
        by: ['itemId'],
        where: { userId: user.id },
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
        const item = await prisma.item.findFirst({
          where: { id: entry.itemId, userId: user.id },
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
    } else if (type === 'by-date') {
      // Return sales grouped by date and category (user-specific)
      const sales = await prisma.sale.findMany({
        where: { userId: user.id },
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
    } else {
      return NextResponse.json({ error: 'Invalid type parameter. Use ?type=summary or ?type=by-date' }, { status: 400 })
    }
  } catch (error) {
    console.error('[GET /api/sale]', error)
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}