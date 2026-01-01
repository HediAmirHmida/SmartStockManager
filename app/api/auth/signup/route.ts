import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json(); // cleaner

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    });

    // Don't auto-login after signup - user needs to login manually
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
