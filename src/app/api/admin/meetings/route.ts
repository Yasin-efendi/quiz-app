import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId, toSlug } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { title, subjectId } = await request.json();
    if (!title || !subjectId) {
      return NextResponse.json({ error: 'Title and subjectId are required' }, { status: 400 });
    }

    const db = await readDB();
    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const newMeeting = {
      id: generateId(),
      subjectId,
      slug: `${subject.slug}-${toSlug(title)}`,
      title
    };

    db.meetings.push(newMeeting);
    await writeDB(db);
    return NextResponse.json(newMeeting, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}