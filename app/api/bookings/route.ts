import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locale = 'de', ...bookingData } = body;
    
    // Get settings for booking number and price calculation
    const settings = await prisma.settings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      throw new Error('Settings not found');
    }

    // Generate Booking Number
    const currentNum = settings.nextBookingNumber;
    const year = settings.bookingYear;
    const bookingNumber = `${String(currentNum).padStart(3, '0')}-${year}`;

    // Server-side price validation/calculation
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) throw new Error('Invalid dates');

    let basePitchPrice = settings.pricePlace;
    const pitchCount = bookingData.pitchCount || 1;
    const smallTent = !!bookingData.smallTent;
    const prepayment = !!bookingData.prepayment;

    // Apply discounts on pitch price
    let discountedPitchPrice = basePitchPrice;
    
    if (smallTent) discountedPitchPrice *= 0.6; // 40% discount
    if (prepayment) discountedPitchPrice *= 0.85; // 15% discount
    
    if (days > 30) discountedPitchPrice *= 0.8; // 20% discount
    else if (days > 7) discountedPitchPrice *= 0.9; // 10% discount

    const dailyPrice = (discountedPitchPrice * pitchCount) + 
                       (bookingData.adults * settings.priceAdult) + 
                       (bookingData.children * settings.priceChild) + 
                       (bookingData.electricity ? settings.priceElectricity : 0);
    
    const totalPrice = dailyPrice * days;

    // Create booking and update settings in a transaction
    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          bookingNumber,
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
          pitchCount: pitchCount,
          smallTent: smallTent,
          prepayment: prepayment,
          electricity: bookingData.electricity || false,
          checkIn: start,
          checkOut: end,
          totalPrice: totalPrice, // Use calculated price
          status: 'pending'
        }
      }),
      prisma.settings.update({
        where: { id: 'default' },
        data: { nextBookingNumber: { increment: 1 } }
      })
    ]);

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking, locale);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
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
