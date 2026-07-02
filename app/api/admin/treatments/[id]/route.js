import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const treatment = await prisma.treatment.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: data.slug,
        speciality: data.speciality,
        description: data.description,
        overview: data.overview,
        symptoms: data.symptoms,
        causes: data.causes,
        diagnosis: data.diagnosis,
        treatmentOptions: data.treatmentOptions,
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
    return NextResponse.json(treatment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.treatment.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
