import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '../../../lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await req.json();

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

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  await prisma.item.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
