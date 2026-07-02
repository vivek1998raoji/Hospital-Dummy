import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        slug: data.slug,
        speciality: data.speciality,
        designation: data.designation,
        qualification: data.qualification,
        experience: data.experience,
        location: data.location,
        about: data.about,
        imageUrl: data.imageUrl || '',
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
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.doctor.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
