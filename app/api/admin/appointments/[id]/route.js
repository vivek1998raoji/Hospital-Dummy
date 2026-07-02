import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
