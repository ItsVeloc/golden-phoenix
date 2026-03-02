'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/public/Nav';
import Footer from '@/components/public/Footer';
import type { TimeSlot, BookingFormData } from '@/types';

type Step = 'date' | 'party' | 'time' | 'details' | 'review';

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('date');
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    partySize: 0,
    timeSlot: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDateObj = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  async function fetchSlots(date: string, partySize: number) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/availability?date=${date}&partySize=${partySize}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSlots(data.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  }

  async function handleContinueToTime() {
    setStep('time');
    await fetchSlots(formData.date, formData.partySize);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/book/confirmation?id=${data.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')}${suffix}`;
  }

  function toDateString(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];

    // Leading blanks (Mon-based: convert Sun=0 to index 6, Mon=1 to index 0)
    const startOffset = (firstDay + 6) % 7;
    for (let i = 0; i < startOffset; i++) days.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [calendarMonth]);

  function isDateSelectable(d: Date): boolean {
    return d >= tomorrow && d <= maxDateObj;
  }

  function prevMonth() {
    setCalendarMonth((prev) => {
      const m = prev.month - 1;
      if (m < 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: m };
    });
  }

  function nextMonth() {
    setCalendarMonth((prev) => {
      const m = prev.month + 1;
      if (m > 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: m };
    });
  }

  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const lunchSlots = slots.filter((s) => s.session === 'lunch' && s.available);
  const dinnerSlots = slots.filter((s) => s.session === 'dinner' && s.available);

  return (
    <>
      <Nav />
      <div className="booking-page">
        <div className="booking-container">
          <h1 className="booking-title">Make a Reservation</h1>
          <div className="booking-steps">
            <span className={step === 'date' ? 'active' : formData.date ? 'done' : ''}>Date</span>
            <span className={step === 'party' ? 'active' : formData.partySize ? 'done' : ''}>Guests</span>
            <span className={step === 'time' ? 'active' : formData.timeSlot ? 'done' : ''}>Time</span>
            <span className={step === 'details' ? 'active' : formData.customerName ? 'done' : ''}>Details</span>
            <span className={step === 'review' ? 'active' : ''}>Confirm</span>
          </div>

          {error && <div className="booking-error">{error}</div>}

          {/* STEP 1: Date — Calendar */}
          {step === 'date' && (
            <div className="booking-step">
              <h2>Select a Date</h2>
              <div className="calendar">
                <div className="calendar-header">
                  <button className="calendar-nav-btn" onClick={prevMonth} type="button">&lsaquo;</button>
                  <span className="calendar-month-label">{monthLabel}</span>
                  <button className="calendar-nav-btn" onClick={nextMonth} type="button">&rsaquo;</button>
                </div>
                <div className="calendar-weekdays">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className="calendar-grid">
                  {calendarDays.map((day, i) => {
                    if (!day) return <span key={`blank-${i}`} className="calendar-day blank" />;
                    const dateStr = toDateString(day);
                    const selectable = isDateSelectable(day);
                    const selected = formData.date === dateStr;
                    const isToday = toDateString(new Date()) === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        className={
                          'calendar-day' +
                          (selected ? ' selected' : '') +
                          (isToday ? ' today' : '') +
                          (!selectable ? ' disabled' : '')
                        }
                        disabled={!selectable}
                        onClick={() => setFormData({ ...formData, date: dateStr, timeSlot: '' })}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
              {formData.date && (
                <p className="calendar-selected-label">{formatDate(formData.date)}</p>
              )}
              <button
                className="booking-next-btn"
                disabled={!formData.date}
                onClick={() => setStep('party')}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Party Size */}
          {step === 'party' && (
            <div className="booking-step">
              <h2>Number of Guests</h2>
              <div className="party-size-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <button
                    key={n}
                    className={`party-size-btn${formData.partySize === n ? ' selected' : ''}`}
                    onClick={() => setFormData({ ...formData, partySize: n })}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="booking-note">For parties of 9 or more, please call us on <a href="tel:+441789638731">01789 638 731</a></p>
              <div className="booking-nav-row">
                <button className="booking-back-btn" onClick={() => setStep('date')}>Back</button>
                <button
                  className="booking-next-btn"
                  disabled={!formData.partySize}
                  onClick={handleContinueToTime}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Time Slot */}
          {step === 'time' && (
            <div className="booking-step">
              <h2>Choose a Time</h2>
              {loading ? (
                <p className="booking-loading">Checking availability...</p>
              ) : lunchSlots.length === 0 && dinnerSlots.length === 0 ? (
                <p className="booking-note">No available time slots for this date and party size. Please try another date.</p>
              ) : (
                <>
                  {lunchSlots.length > 0 && (
                    <div className="time-session">
                      <h3>Lunch</h3>
                      <div className="time-slot-grid">
                        {lunchSlots.map((s) => (
                          <button
                            key={s.time}
                            className={`time-slot-btn${formData.timeSlot === s.time ? ' selected' : ''}`}
                            onClick={() => setFormData({ ...formData, timeSlot: s.time })}
                          >
                            {formatTime(s.time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {dinnerSlots.length > 0 && (
                    <div className="time-session">
                      <h3>Dinner</h3>
                      <div className="time-slot-grid">
                        {dinnerSlots.map((s) => (
                          <button
                            key={s.time}
                            className={`time-slot-btn${formData.timeSlot === s.time ? ' selected' : ''}`}
                            onClick={() => setFormData({ ...formData, timeSlot: s.time })}
                          >
                            {formatTime(s.time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="booking-nav-row">
                <button className="booking-back-btn" onClick={() => setStep('party')}>Back</button>
                <button
                  className="booking-next-btn"
                  disabled={!formData.timeSlot}
                  onClick={() => setStep('details')}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Customer Details */}
          {step === 'details' && (
            <div className="booking-step">
              <h2>Your Details</h2>
              <div className="booking-form">
                <label>
                  <span>Full Name</span>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Smith"
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                  />
                </label>
                <label>
                  <span>Phone</span>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="07700 900000"
                  />
                </label>
              </div>
              <div className="booking-nav-row">
                <button className="booking-back-btn" onClick={() => setStep('time')}>Back</button>
                <button
                  className="booking-next-btn"
                  disabled={!formData.customerName || !formData.customerEmail || !formData.customerPhone}
                  onClick={() => setStep('review')}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Confirm */}
          {step === 'review' && (
            <div className="booking-step">
              <h2>Review Your Booking</h2>
              <div className="booking-summary">
                <div className="summary-row">
                  <span className="summary-label">Date</span>
                  <span>{formatDate(formData.date)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Time</span>
                  <span>{formatTime(formData.timeSlot)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Guests</span>
                  <span>{formData.partySize}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Name</span>
                  <span>{formData.customerName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Email</span>
                  <span>{formData.customerEmail}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Phone</span>
                  <span>{formData.customerPhone}</span>
                </div>
              </div>
              <div className="booking-nav-row">
                <button className="booking-back-btn" onClick={() => setStep('details')}>Back</button>
                <button
                  className="booking-confirm-btn"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
