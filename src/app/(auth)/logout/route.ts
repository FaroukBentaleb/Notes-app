// src/app/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Delete the cookie
  const cookieStore = await cookies();
  cookieStore.delete('currentUser');
  
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}