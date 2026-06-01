import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { content, meetingId, options, correctIndex, explanation } = await request.json();
    
    if (!content || !meetingId || !Array.isArray(options) || typeof correctIndex !== 'number') {
      return NextResponse.json({ error: 'Invalid question payload' }, { status: 400 });
    }

    const db = await readDB();
    const meeting = db.meetings.find(m => m.id === meetingId);
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const newQuestion = {
      id: generateId(),
      meetingId,
      content,
      options,
      correctIndex,
      explanation: explanation || ''
    };

    db.questions.push(newQuestion);
    await writeDB(db);
    return NextResponse.json(newQuestion, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}