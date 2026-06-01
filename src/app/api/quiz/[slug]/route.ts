import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const db = await readDB();
    const meeting = db.meetings.find(m => m.slug === slug);
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const questions = db.questions.filter(q => q.meetingId === meeting.id);
    return NextResponse.json({ meeting, questions }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}