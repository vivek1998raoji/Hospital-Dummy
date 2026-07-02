import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  const location = searchParams.get('location');
  const where = { active: true };
  if (department) where.department = department;
  if (location) where.location = location;
  try {
    const careers = await prisma.career.findMany({ where, orderBy: { postedAt: 'desc' } });
    return NextResponse.json(careers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
