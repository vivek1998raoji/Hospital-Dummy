import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const location = await prisma.location.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address,
        phone: data.phone,
        beds: data.beds,
        description: data.description,
        image: data.image || '',
        mapUrl: data.mapUrl || '',
        specialities: data.specialities || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
        schemaJson: data.schemaJson || '',
        ogTitle: data.ogTitle || '',
        ogDescription: data.ogDescription || '',
        ogImage: data.ogImage || '',
        canonicalUrl: data.canonicalUrl || '',
        robots: data.robots || 'index, follow',
        imageAlt: data.imageAlt || ''
      }
    });
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.location.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
