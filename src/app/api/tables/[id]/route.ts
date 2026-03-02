import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifySession } from '@/lib/auth';

// PATCH - Admin only: update table
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifySession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = body.name;
  if (body.capacity !== undefined) updates.capacity = body.capacity;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  const { data, error } = await supabase
    .from('tables')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }

  return NextResponse.json({ table: data });
}

// DELETE - Admin only: remove table (only if no future bookings)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifySession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const today = new Date().toISOString().split('T')[0];

  // Check for future bookings
  const { data: futureBookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('table_id', id)
    .gte('booking_date', today)
    .eq('status', 'confirmed')
    .limit(1);

  if (futureBookings && futureBookings.length > 0) {
    return NextResponse.json(
      { error: 'Cannot delete table with future bookings. Reassign or cancel them first.' },
      { status: 409 }
    );
  }

  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
