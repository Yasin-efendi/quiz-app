'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subject {
  id: string;
  slug: string;
  title: string;
  description?: string;
}

interface Meeting {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
}

export default function HomePage() {
  const [data, setData] = useState<{ subjects: Subject[]; meetings: Meeting[] }>({ subjects: [], meetings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Memuat data pelajaran...</p></div>;

  return (
    <>
      <header className="header">
        <h1>Latihan Soal Ujian Sekolah</h1>
        <p>Bahasa Inggris Kelas 3 SD</p>
      </header>

      <section className="grid-subjects">
        {data.subjects.length === 0 && <p className="card">Belum ada pelajaran tersedia.</p>}
        
        {data.subjects.map(subject => (
          <div key={subject.id} className="card subject-card">
            <h2>{subject.title}</h2>
            {subject.description && <p>{subject.description}</p>}
            
            <div className="meeting-list">
              <h3>Subtema:</h3>
              {data.meetings
                .filter(m => m.subjectId === subject.id)
                .map(meeting => (
                  <div key={meeting.id} className="meeting-item">
                    <span>{meeting.title}</span>
                    <Link href={`/quiz/${meeting.slug}`} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      Mulai Kuis
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}