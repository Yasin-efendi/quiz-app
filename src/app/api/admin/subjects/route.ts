import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId, toSlug } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = await readDB();
    const newSubject = {
      id: generateId(),
      slug: toSlug(title),
      title,
      description: description || ''
    };

    db.subjects.push(newSubject);
    await writeDB(db);
    return NextResponse.json(newSubject, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}