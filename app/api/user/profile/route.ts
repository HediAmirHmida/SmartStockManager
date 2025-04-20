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
    const { name, email, password } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // If password is provided, hash it; otherwise, retain the existing password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return new Response(JSON.stringify({ message: 'Profile updated successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Profile Update API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
