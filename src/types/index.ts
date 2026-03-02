export interface Table {
  id: number;
  name: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export interface OpeningHours {
  id: number;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  session_name: 'lunch' | 'dinner';
  open_time: string; // HH:MM
  close_time: string; // HH:MM
  slot_interval: number; // minutes
  is_active: boolean;
}

export interface Booking {
  id: number;
  booking_date: string; // YYYY-MM-DD
  time_slot: string; // HH:MM
  party_size: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  table_id: number | null;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DateClosure {
  id: number;
  closed_date: string; // YYYY-MM-DD
  reason: string | null;
}

export interface TimeSlot {
  time: string; // HH:MM
  session: 'lunch' | 'dinner';
  available: boolean;
}

export interface BookingFormData {
  date: string;
  partySize: number;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
