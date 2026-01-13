import { cookies } from 'next/headers';
import prisma from './prisma';

export async function getCurrentUser() {
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

export async function requireAuth() {
  const user = await getCurrentUser();
  return user;
}