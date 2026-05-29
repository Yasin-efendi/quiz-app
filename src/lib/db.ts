import { promises as fs } from 'fs';
import path from 'path';

// --- Types ---
export type Subject = {
  id: string;
  slug: string;
  title: string;
  description?: string;
};

export type Meeting = {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
};

export type Question = {
  id: string;
  meetingId: string;
  content: string; // HTML string (e.g., "Apa hasil dari <br>2 + 2?")
  options: string[];
  correctIndex: number; // 0-3
  explanation: string;
};

export interface Database {
  subjects: Subject[];
  meetings: Meeting[];
  questions: Question[];
}

// --- Config ---
const DB_PATH = path.join(process.cwd(), 'db.json');

const DEFAULT_DB: Database = {
  subjects: [],
  meetings: [],
  questions: []
};

// --- Helpers ---
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 6)}`;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// --- Core Functions ---
export async function readDB(): Promise<Database> {
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(content) as Database;

    // Basic validation
    if (
      Array.isArray(parsed.subjects) &&
      Array.isArray(parsed.meetings) &&
      Array.isArray(parsed.questions)
    ) {
      return parsed;
    }

    console.warn('⚠️ DB structure invalid. Resetting to default.');
    await writeDB(DEFAULT_DB);
    return DEFAULT_DB;
  } catch {
    // File missing or unreadable
    console.warn('⚠️ db.json not found or unreadable. Initializing default DB.');
    await writeDB(DEFAULT_DB);
    return DEFAULT_DB;
  }
}

export async function writeDB(data: Database): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Failed to write db.json:', error);
    throw new Error('Database write operation failed');
  }
}

// Export utils for Admin API
export { generateId, toSlug };