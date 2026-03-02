import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get('date');
  const partySize = parseInt(searchParams.get('partySize') || '0', 10);

  if (!date || !partySize || partySize < 1) {
    return NextResponse.json(
      { error: 'date and partySize are required' },
      { status: 400 }
    );
  }

  // Validate date is not in the past and not more than 60 days ahead
  const bookingDate = new Date(date + 'T00:00:00');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  if (bookingDate < tomorrow) {
    return NextResponse.json(
      { error: 'Cannot book in the past' },
      { status: 400 }
    );
  }

  if (bookingDate > maxDate) {
    return NextResponse.json(
      { error: 'Cannot book more than 60 days ahead' },
      { status: 400 }
    );
  }

  const slots = await getAvailableSlots(date, partySize);
  return NextResponse.json({ slots });
}
