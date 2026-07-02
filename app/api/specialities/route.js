import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



export async function GET() {
  try {
    const specialities = await prisma.speciality.findMany();
    return NextResponse.json(specialities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch specialities' }, { status: 500 });
  }
}
