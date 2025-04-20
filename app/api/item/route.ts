import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newItem = await prisma.item.create({
      data: {
        name: body.name,
        description: body.description ?? '',
        quantity: body.quantity ?? 0,
        imageUrl: body.imageUrl || null, // Make optional
        category: {
          connect: { id: body.categoryId },
        },
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    return new NextResponse('Error creating item', { status: 500 });
  }
}
