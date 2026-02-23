import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const booking = await prisma.booking.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        street: body.street,
        postalCode: body.postalCode,
        city: body.city,
        country: body.country,
        phone: body.phone,
        email: body.email,
        adults: body.adults,
        children: body.children,
        electricity: body.electricity || false,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        totalPrice: body.totalPrice,
        status: 'pending'
      }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status } : {};
    
    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
