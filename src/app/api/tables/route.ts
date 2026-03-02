import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifySession } from '@/lib/auth';

// GET - Admin only: list all tables
export async function GET(request: NextRequest) {
  if (!(await verifySession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }

  return NextResponse.json({ tables: data });
}

// POST - Admin only: create a table
export async function POST(request: NextRequest) {
  if (!(await verifySession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, capacity } = await request.json();

  if (!name || !capacity) {
    return NextResponse.json({ error: 'Name and capacity are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tables')
    .insert({ name, capacity })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }

  return NextResponse.json({ table: data }, { status: 201 });
}
