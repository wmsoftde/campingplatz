import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locale = 'de', ...bookingData } = body;
    
    const booking = await prisma.booking.create({
      data: {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        street: bookingData.street,
        postalCode: bookingData.postalCode,
        city: bookingData.city,
        country: bookingData.country,
        phone: bookingData.phone,
        email: bookingData.email,
        adults: bookingData.adults,
        children: bookingData.children,
        electricity: bookingData.electricity || false,
        checkIn: new Date(bookingData.checkIn),
        checkOut: new Date(bookingData.checkOut),
        totalPrice: bookingData.totalPrice,
        status: 'pending'
      }
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking, locale);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // We don't fail the request if email fails, but it's logged
    }

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
