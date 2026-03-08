import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendBookingStatusUpdate } from '@/lib/email';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, locale = 'de' } = await request.json();
    
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    // Send status update email
    try {
      if (['confirmed', 'cancelled', 'rejected'].includes(status)) {
        await sendBookingStatusUpdate(booking, status as any, locale);
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
