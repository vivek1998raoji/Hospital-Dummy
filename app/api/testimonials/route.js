import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const where = {};
  if (featured === 'true') where.featured = true;
  try {
    const testimonials = await prisma.testimonial.findMany({ where });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
