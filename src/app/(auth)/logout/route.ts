// src/app/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Delete the cookie
  const cookieStore = await cookies();
  cookieStore.delete('currentUser');
  
  // Redirect to login page
  return NextResponse.redirect(new URL('/login', 'http://localhost:3000'));
}