import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const where = {};
  if (category) where.category = category;
  if (featured === 'true') where.featured = true;
  try {
    const blogs = await prisma.blog.findMany({ where, orderBy: { publishedAt: 'desc' } });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
