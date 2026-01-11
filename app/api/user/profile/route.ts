import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

export async function GET() {
  const cookieStore = await cookies(); // ✅ await cookies()
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  return Response.json({
    name: user.name,
    email: user.email,
  });
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies(); // ✅ await cookies()
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
    }

    const body = await req.json(); // Parse the incoming request body
    const { name, password } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Build update data - only update fields that are provided
    const updateData: { name: string; password?: string } = { name };

    // If password is provided, hash it; otherwise, don't update password
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData
    });

    return new Response(JSON.stringify({ message: 'Profile updated successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Profile Update API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
