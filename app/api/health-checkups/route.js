import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const popular = searchParams.get('popular');
  const where = {};
  if (popular === 'true') where.popular = true;
  try {
    const checkups = await prisma.healthCheckup.findMany({ where });
    return NextResponse.json(checkups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch health checkups' }, { status: 500 });
  }
}
