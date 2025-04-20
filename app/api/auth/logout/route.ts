import { NextResponse } from 'next/server';
import { deleteCookie } from 'cookies-next';

export async function GET() {
  // Remove the session cookie
  deleteCookie('user_id');

  return NextResponse.json({ message: 'Logged out successfully' });
}
