import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { assignTable } from '@/lib/availability';
import { getResend } from '@/lib/resend';
import { bookingConfirmationEmail } from '@/lib/email-templates';
import { verifySession } from '@/lib/auth';

// POST - Public: create a booking
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, partySize, timeSlot, customerName, customerEmail, customerPhone } = body;

  if (!date || !partySize || !timeSlot || !customerName || !customerEmail || !customerPhone) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (partySize < 1 || partySize > 8) {
    return NextResponse.json({ error: 'Party size must be 1-8' }, { status: 400 });
  }

  // Assign a table
  const tableId = await assignTable(date, timeSlot, partySize);
  if (tableId === null) {
    return NextResponse.json(
      { error: 'No tables available for this time slot' },
      { status: 409 }
    );
  }

  // Create booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      booking_date: date,
      time_slot: timeSlot,
      party_size: partySize,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      table_id: tableId,
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }

  // Send confirmation email
  try {
    const email = bookingConfirmationEmail({
      customerName,
      date,
      time: timeSlot,
      partySize,
      id: booking.id,
    });

    await getResend().emails.send({
      from: 'Golden Phoenix <bookings@goldenphoenixstratford.com>',
      to: customerEmail,
      subject: email.subject,
      html: email.html,
    });
  } catch {
    // Don't fail the booking if email fails
    console.error('Failed to send confirmation email');
  }

  return NextResponse.json({ booking }, { status: 201 });
}

// GET - Admin only: list bookings
export async function GET(request: NextRequest) {
  if (!(await verifySession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const date = searchParams.get('date');

  let query = supabase
    .from('bookings')
    .select('*, tables(name)')
    .order('time_slot', { ascending: true });

  if (date) {
    query = query.eq('booking_date', date);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
