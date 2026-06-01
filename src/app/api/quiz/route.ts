import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(db, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch quiz data' }, { status: 500 });
  }
}