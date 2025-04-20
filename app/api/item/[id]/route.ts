import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);
  const data = await req.json();

  if (isNaN(id)) {
    return new NextResponse('Invalid item ID', { status: 400 });
  }

  const updatedItem = await prisma.item.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      quantity: data.quantity,
      imageUrl: data.imageUrl,
      category: {
        connect: { id: data.categoryId },
      },
    },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid item ID', { status: 400 });
  }

  await prisma.item.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
