import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Gets the id from the route
  const categoryId = parseInt(id || '', 10);

  if (isNaN(categoryId)) {
    return new NextResponse('Invalid category ID', { status: 400 });
  }

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
