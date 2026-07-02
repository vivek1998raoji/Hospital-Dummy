import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { doctor: true }
    });

    const mapped = appointments.map(appt => {
      let hospital = '';
      let speciality = '';
      let doctorName = appt.doctor ? appt.doctor.name : '';

      // Simple parsing of structured messages
      const msg = appt.message || '';
      const hospitalMatch = msg.match(/Hospital Location:\s*([^\n]+)/);
      const specialityMatch = msg.match(/Speciality:\s*([^\n]+)/);
      const packageMatch = msg.match(/Selected Health Package:\s*([^\n]+)/);

      if (hospitalMatch) hospital = hospitalMatch[1].trim();
      if (specialityMatch) speciality = specialityMatch[1].trim();
      if (packageMatch) {
        speciality = `📦 Package: ${packageMatch[1].trim()}`;
      }

      // Fallbacks
      if (appt.doctor) {
        if (!hospital) hospital = appt.doctor.location;
        if (!speciality) speciality = appt.doctor.speciality;
      }

      return {
        id: appt.id,
        name: appt.patient,
        phone: appt.phone,
        email: appt.email,
        date: appt.date,
        time: appt.time,
        status: appt.status,
        message: appt.message,
        speciality: speciality || 'General Consult',
        doctor: doctorName || (packageMatch ? 'Health Package' : ''),
        hospital: hospital || 'Not Specified',
        createdAt: appt.createdAt
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, speciality, doctor, hospital, date, time, message, bookingType, healthPackage } = body;

    if (!name || !phone || !date) {
      return NextResponse.json({ error: 'Name, phone, and date are required' }, { status: 400 });
    }

    let resolvedDoctorId = null;
    if (bookingType !== 'package' && doctor) {
      const dbDoctor = await prisma.doctor.findUnique({
        where: { slug: doctor }
      });
      if (dbDoctor) {
        resolvedDoctorId = dbDoctor.id;
      }
    }

    // Build structured message to represent chosen options clearly
    let structuredMessage = '';
    if (bookingType === 'package' || healthPackage) {
      structuredMessage += `Selected Health Package: ${healthPackage || 'Preventive Checkup'}\n`;
    } else {
      if (speciality) structuredMessage += `Speciality: ${speciality}\n`;
      if (doctor) structuredMessage += `Requested Doctor Slug: ${doctor}\n`;
    }
    
    structuredMessage += `Hospital Location: ${hospital || 'Not Selected'}\n`;
    if (message) {
      structuredMessage += `Patient Notes: ${message}\n`;
    }

    const appointment = await prisma.appointment.create({
      data: {
        patient: name,
        phone,
        email: email || '',
        date,
        time: time || 'Any Time',
        doctorId: resolvedDoctorId,
        message: structuredMessage,
      },
    });

    return NextResponse.json({ success: true, id: appointment.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to submit appointment request' }, { status: 500 });
  }
}
