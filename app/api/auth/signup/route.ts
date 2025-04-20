import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.text(); 
    console.log("Raw request body:", body);

    const { email, password, name } = JSON.parse(body); // Manually parse the input and add name
    console.log("Parsed email:", email);
    console.log("Parsed name:", name);

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
        name,  // Add the name field here
      }
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
