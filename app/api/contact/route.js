import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    const inquiry = await prisma.contactInquiry.create({
      data: { name, email, phone: phone || '', subject: subject || '', message },
    });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
