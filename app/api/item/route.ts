import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
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

export async function GET() {
  try {
    const user = await requireAuth();

    const items = await prisma.item.findMany({
      where: { userId: user.id },
      include: { category: true },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const newItem = await prisma.item.create({
      data: {
        name: body.name,
        description: body.description ?? '',
        quantity: body.quantity ?? 0,
        imageUrl: body.imageUrl || null,
        categoryId: body.categoryId,
        userId: user.id,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}
