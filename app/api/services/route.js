import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const where = {};
  if (category) where.category = category;
  try {
    const services = await prisma.service.findMany({ where });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
