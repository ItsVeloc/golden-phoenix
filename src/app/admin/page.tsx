'use client';

import { useEffect, useState } from 'react';
import type { Booking } from '@/types';

export default function AdminDashboard() {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [weekCounts, setWeekCounts] = useState<{ date: string; dayName: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch today's bookings
        const res = await fetch(`/api/bookings?date=${today}`);
        const data = await res.json();
        const confirmed = (data.bookings || []).filter(
          (b: Booking) => b.status === 'confirmed'
        );
        setTodayBookings(confirmed);

        // Fetch next 7 days
        const counts = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
          const dateDisplay = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

          const r = await fetch(`/api/bookings?date=${dateStr}`);
          const dd = await r.json();
          const c = (dd.bookings || []).filter(
            (b: Booking) => b.status === 'confirmed'
          ).length;
          counts.push({ date: dateDisplay, dayName, count: c });
        }
        setWeekCounts(counts);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [today]);

  const totalCovers = todayBookings.reduce((sum, b) => sum + b.party_size, 0);

  function formatTime(time: string) {
    const [h, m] = time.substring(0, 5).split(':').map(Number);
    const suffix = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')}${suffix}`;
  }

  if (loading) {
    return <h1>Dashboard</h1>;
  }

  return (
    <>
      <h1>Dashboard</h1>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{todayBookings.length}</div>
          <div className="admin-stat-label">Today&apos;s Bookings</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{totalCovers}</div>
          <div className="admin-stat-label">Total Covers</div>
        </div>
      </div>

      <h2 style={{ fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '16px', fontWeight: 400 }}>
        Next 7 Days
      </h2>
      <div className="week-overview">
        {weekCounts.map((d, i) => (
          <div className="week-day-card" key={i}>
            <div className="day-name">{d.dayName}</div>
            <div className="day-date">{d.date}</div>
            <div className="day-count">{d.count}</div>
          </div>
        ))}
      </div>

      {todayBookings.length > 0 && (
        <>
          <h2 style={{ fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '16px', fontWeight: 400 }}>
            Today&apos;s Bookings
          </h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Name</th>
                <th>Guests</th>
                <th>Phone</th>
                <th>Table</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map((b) => (
                <tr key={b.id}>
                  <td>{formatTime(b.time_slot)}</td>
                  <td>{b.customer_name}</td>
                  <td>{b.party_size}</td>
                  <td>{b.customer_phone}</td>
                  <td>{(b as Booking & { tables?: { name: string } }).tables?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
