'use client';

import { useEffect, useState } from 'react';
import type { Booking, Table } from '@/types';

type BookingWithTable = Booking & { tables?: { name: string } };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithTable[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchTables();
  }, [date]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?date=${date}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  async function fetchTables() {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data.tables || []);
    } catch {
      console.error('Failed to fetch tables');
    }
  }

  async function cancelBooking(id: number) {
    if (!confirm('Cancel this booking?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  }

  async function changeTable(bookingId: number, tableId: string) {
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table_id: tableId ? parseInt(tableId) : null }),
    });
    fetchBookings();
  }

  function formatTime(time: string) {
    const [h, m] = time.substring(0, 5).split(':').map(Number);
    const suffix = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')}${suffix}`;
  }

  return (
    <>
      <h1>Bookings</h1>

      <div className="admin-date-filter">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--cream-dim)' }}>Loading...</p>
      ) : bookings.length === 0 ? (
        <p style={{ color: 'var(--cream-dim)' }}>No bookings for this date.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Name</th>
              <th>Guests</th>
              <th>Phone</th>
              <th>Table</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{formatTime(b.time_slot)}</td>
                <td>{b.customer_name}</td>
                <td>{b.party_size}</td>
                <td>{b.customer_phone}</td>
                <td>
                  <select
                    value={b.table_id || ''}
                    onChange={(e) => changeTable(b.id, e.target.value)}
                    style={{
                      background: 'var(--charcoal)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--cream)',
                      padding: '4px 8px',
                      fontFamily: 'var(--sans)',
                      fontSize: '12px',
                    }}
                  >
                    <option value="">Unassigned</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.capacity})</option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`status-badge status-${b.status}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === 'confirmed' && (
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
