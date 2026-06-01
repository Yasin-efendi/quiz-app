// src/app/api/admin/meetings/[id]/route.ts
import { NextResponse } from 'next/server';
import { readDB, writeDB, toSlug } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { title, subjectId } = await request.json();
    if (!title || !subjectId) {
      return NextResponse.json({ error: 'Title and subjectId are required' }, { status: 400 });
    }

    const db = await readDB();
    const idx = db.meetings.findIndex(m => m.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });

    const subject = db.subjects.find(s => s.id === subjectId);
    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });

    // Regenerate slug jika subject atau title berubah
    db.meetings[idx] = {
      ...db.meetings[idx],
      title,
      subjectId,
      slug: `${subject.slug}-${toSlug(title)}`
    };

    await writeDB(db);
    return NextResponse.json(db.meetings[idx], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await readDB();
    // Cascade delete: hapus juga soal yang terkait dengan pertemuan ini
    db.questions = db.questions.filter(q => q.meetingId !== id);
    db.meetings = db.meetings.filter(m => m.id !== id);
    await writeDB(db);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}