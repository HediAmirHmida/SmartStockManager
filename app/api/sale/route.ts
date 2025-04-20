import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(req: NextRequest) {
  const { itemId, quantity, price } = await req.json();

  // Get item to check current quantity
  const item = await prisma.item.findUnique({
    where: { id: itemId },
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
      data: { itemId, quantity, price, total },
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
}
