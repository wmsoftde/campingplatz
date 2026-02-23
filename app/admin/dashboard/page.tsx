import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const totalBookings = await prisma.booking.count();
  const pendingBookings = await prisma.booking.count({
    where: { status: 'pending' }
  });
  const confirmedBookings = await prisma.booking.count({
    where: { status: 'confirmed' }
  });
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-primary">{totalBookings}</div>
          <div className="text-gray-500">Buchungen gesamt</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-3xl font-bold text-yellow-600">{pendingBookings}</div>
          <div className="text-gray-500">Offene Buchungen</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-green-600">{confirmedBookings}</div>
          <div className="text-gray-500">Bestätigt</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-3xl font-bold text-blue-600">
            {await prisma.post.count({ where: { published: true } })}
          </div>
          <div className="text-gray-500">Veröffentlichte Beiträge</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-xl font-bold">Aktuelle Buchungen</h2>
          <Link
            href="/admin/bookings"
            className="text-primary hover:underline"
          >
            Alle anzeigen →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-gray-500">Noch keine Buchungen vorhanden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Datum</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Preis</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {booking.firstName} {booking.lastName}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(booking.checkIn).toLocaleDateString('de-DE')} - 
                      {new Date(booking.checkOut).toLocaleDateString('de-DE')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      €{booking.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
