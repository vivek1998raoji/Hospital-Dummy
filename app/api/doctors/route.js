import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const speciality = searchParams.get('speciality');
  const query = searchParams.get('query');

  const where = {};
  
  if (location) {
    where.location = location;
  }
  
  if (speciality) {
    where.speciality = speciality;
  }
  
  if (query) {
    where.name = {
      contains: query
    };
  }

  try {
    const doctors = await prisma.doctor.findMany({ where });
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
