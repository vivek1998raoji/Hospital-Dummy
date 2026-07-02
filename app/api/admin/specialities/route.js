import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(request) {
  try {
    const data = await request.json();
    const speciality = await prisma.speciality.create({ data });
    return NextResponse.json(speciality, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create speciality' }, { status: 500 });
  }
}
