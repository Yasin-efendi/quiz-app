// src/app/api/admin/subjects/[id]/route.ts
import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { title, description } = await request.json();
    const db = await readDB();
    const idx = db.subjects.findIndex(s => s.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });

    db.subjects[idx].title = title || db.subjects[idx].title;
    db.subjects[idx].description = description ?? db.subjects[idx].description;
    await writeDB(db);
    return NextResponse.json(db.subjects[idx], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await readDB();
    db.subjects = db.subjects.filter(s => s.id !== id);
    await writeDB(db);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
  }
}