import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { cookies } from 'next/headers';

async function requireAuth() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      throw new Error('No user session found');
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error('Authentication required');
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop() || '', 10);
    const data = await req.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    // Verify the item belongs to the user
    const existingItem = await prisma.item.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop() || '', 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    // Verify the item belongs to the user
    const existingItem = await prisma.item.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}
