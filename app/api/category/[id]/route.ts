// app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const categoryId = parseInt(params.id);
  
    try {
      // Delete all items associated with this category
      await prisma.item.deleteMany({
        where: { categoryId },
      });
  
      // Then delete the category itself
      await prisma.category.delete({
        where: { id: categoryId },
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      return new NextResponse('Failed to delete category', { status: 500 });
    }
  }