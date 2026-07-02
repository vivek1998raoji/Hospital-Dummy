import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(request) {
  try {
    const data = await request.json();
    const treatment = await prisma.treatment.create({ data });
    return NextResponse.json(treatment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create treatment' }, { status: 500 });
  }
}
