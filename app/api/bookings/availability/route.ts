import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    
    const settings = await prisma.settings.findFirst();
    const totalPlaces = settings?.totalPlaces || 100;
    
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));
    
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            checkIn: { lte: endDate },
            checkOut: { gte: startDate }
          }
        ]
      }
    });
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Date.UTC(year, month - 1, day));
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      let booked = 0;
      bookings.forEach(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        
        // Use UTC time for comparison to avoid timezone issues
        const currentUTC = currentDate.getTime();
        const checkInUTC = checkIn.getTime();
        const checkOutUTC = checkOut.getTime();
        
        if (currentUTC >= checkInUTC && currentUTC < checkOutUTC) {
          booked++;
        }
      });
      
      const pricePlace = settings?.pricePlace || 8;
      
      monthData.push({
        date: dateStr,
        price: pricePlace,
        booked,
        total: totalPlaces
      });
    }
    
    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
