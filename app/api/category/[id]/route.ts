// app/api/category/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id);

  try {
    await prisma.item.deleteMany({
      where: { categoryId },
    });

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return new NextResponse('Failed to delete category', { status: 500 });
  }
}
