import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const page = await prisma.page.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        slug: data.slug,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
        content: data.content || '',
        schemaJson: data.schemaJson || '',
        ogTitle: data.ogTitle || '',
        ogDescription: data.ogDescription || '',
        ogImage: data.ogImage || '',
        canonicalUrl: data.canonicalUrl || '',
        robots: data.robots || 'index, follow'
      }
    });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.page.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
