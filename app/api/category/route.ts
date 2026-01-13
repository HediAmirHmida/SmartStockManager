import prisma from '../../lib/prisma'
import { NextResponse } from 'next/server';
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

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      include: { items: true },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const data = await req.json();

    const category = await prisma.category.create({
      data: {
        name: data.name,
        userId: user.id
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
}
