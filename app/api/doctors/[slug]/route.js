import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const doctor = await prisma.doctor.findUnique({ where: { slug } });
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}
