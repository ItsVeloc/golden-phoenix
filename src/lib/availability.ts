import { supabase } from './supabase';
import type { TimeSlot } from '@/types';

export async function getAvailableSlots(
  date: string,
  partySize: number
): Promise<TimeSlot[]> {
  // 1. Check if date is closed
  const { data: closure } = await supabase
    .from('date_closures')
    .select('id')
    .eq('closed_date', date)
    .maybeSingle();

  if (closure) return [];

  // 2. Get day of week (JS: 0=Sunday)
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();

  // 3. Get opening hours for that day
  const { data: hours } = await supabase
    .from('opening_hours')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .order('open_time');

  if (!hours || hours.length === 0) return [];

  // 4. Get all active tables that can fit the party
  const { data: tables } = await supabase
    .from('tables')
    .select('id, capacity')
    .eq('is_active', true)
    .gte('capacity', partySize);

  if (!tables || tables.length === 0) return [];

  const tableIds = tables.map((t) => t.id);

  // 5. Get existing bookings for this date (only confirmed ones)
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('time_slot, table_id')
    .eq('booking_date', date)
    .eq('status', 'confirmed');

  // 6. Generate slots and check availability
  const slots: TimeSlot[] = [];

  for (const session of hours) {
    const interval = session.slot_interval || 30;
    const openMinutes = timeToMinutes(session.open_time);
    const closeMinutes = timeToMinutes(session.close_time);

    for (let mins = openMinutes; mins < closeMinutes; mins += interval) {
      const slotTime = minutesToTime(mins);

      // Count how many suitable tables are already booked at this time
      const bookedTableIds = (existingBookings || [])
        .filter((b) => normalizeTime(b.time_slot) === slotTime)
        .map((b) => b.table_id)
        .filter((id): id is number => id !== null);

      const availableTableCount = tableIds.filter(
        (id) => !bookedTableIds.includes(id)
      ).length;

      slots.push({
        time: slotTime,
        session: session.session_name as 'lunch' | 'dinner',
        available: availableTableCount > 0,
      });
    }
  }

  return slots;
}

export async function assignTable(
  date: string,
  timeSlot: string,
  partySize: number
): Promise<number | null> {
  // Find the smallest available table that fits the party
  const { data: tables } = await supabase
    .from('tables')
    .select('id, capacity')
    .eq('is_active', true)
    .gte('capacity', partySize)
    .order('capacity', { ascending: true });

  if (!tables || tables.length === 0) return null;

  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('table_id')
    .eq('booking_date', date)
    .eq('time_slot', timeSlot)
    .eq('status', 'confirmed');

  const bookedTableIds = (existingBookings || [])
    .map((b) => b.table_id)
    .filter((id): id is number => id !== null);

  const availableTable = tables.find((t) => !bookedTableIds.includes(t.id));
  return availableTable?.id ?? null;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function normalizeTime(time: string): string {
  // Handle "HH:MM:SS" from Supabase → "HH:MM"
  return time.substring(0, 5);
}
