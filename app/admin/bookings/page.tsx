'use client';

import { useState, useEffect } from 'react';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  electricity: boolean;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    const url = filter === 'all' ? '/api/bookings' : `/api/bookings?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchBookings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Buchung wirklich löschen?')) return;
    
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  };

  const exportCSV = () => {
    const headers = ['Name', 'E-Mail', 'Telefon', 'Erwachsene', 'Kinder', 'Strom', 'Check-In', 'Check-Out', 'Preis', 'Status', 'Datum'];
    const rows = bookings.map(b => [
      `${b.firstName} ${b.lastName}`,
      b.email,
      b.phone,
      b.adults,
      b.children,
      b.electricity ? 'Ja' : 'Nein',
      new Date(b.checkIn).toLocaleDateString('de-DE'),
      new Date(b.checkOut).toLocaleDateString('de-DE'),
      b.totalPrice,
      b.status,
      new Date(b.createdAt).toLocaleDateString('de-DE')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buchungen.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800">
          Buchungsverwaltung
        </h1>
        <button onClick={exportCSV} className="btn-secondary">
          CSV Export
        </button>
      </div>

      <div className="flex space-x-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'Alle' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">Noch keine Buchungen vorhanden.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Gast</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Datum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Gäste</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Preis</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium">{booking.firstName} {booking.lastName}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{new Date(booking.checkIn).toLocaleDateString('de-DE')}</div>
                      <div className="text-sm text-gray-500">→ {new Date(booking.checkOut).toLocaleDateString('de-DE')}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{booking.adults} Erw.</div>
                      {booking.children > 0 && (
                        <div className="text-sm text-gray-500">{booking.children} Kinder</div>
                      )}
                      {booking.electricity && (
                        <div className="text-sm text-yellow-600">⚡ Strom</div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      €{booking.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Bestätigen
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'rejected')}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Ablehnen
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="text-gray-600 hover:underline text-sm"
                        >
                          Stornieren
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
