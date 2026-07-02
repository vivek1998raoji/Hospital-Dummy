import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const speciality = searchParams.get('speciality');
  const where = {};
  if (speciality) where.speciality = speciality;
  try {
    const treatments = await prisma.treatment.findMany({ where });
    return NextResponse.json(treatments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch treatments' }, { status: 500 });
  }
}
