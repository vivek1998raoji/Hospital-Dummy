import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const treatment = await prisma.treatment.findUnique({ where: { slug } });
    if (!treatment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(treatment);
  } catch (error) {
    console.error('Treatment fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch treatment' }, { status: 500 });
  }
}
