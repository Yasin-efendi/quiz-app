import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const db = await readDB();
    const idx = db.questions.findIndex(q => q.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    db.questions[idx] = { ...db.questions[idx], ...body };
    await writeDB(db);
    return NextResponse.json(db.questions[idx], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await readDB();
    db.questions = db.questions.filter(q => q.id !== id);
    await writeDB(db);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}