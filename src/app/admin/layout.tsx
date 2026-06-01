// src/app/admin/layout.tsx
import Link from 'next/link';
import '../globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <h1>🛠️ Panel Admin</h1>
        <p>Kelola Pelajaran, Pertemuan, dan Bank Soal</p>
      </header>
      
      <nav style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin" className="btn btn-secondary">Dashboard</Link>
        <Link href="/admin/subjects" className="btn btn-secondary">Pelajaran</Link>
        <Link href="/admin/meetings" className="btn btn-secondary">Pertemuan</Link>
        <Link href="/admin/questions" className="btn btn-secondary">Bank Soal</Link>
        <Link href="/" className="btn btn-secondary" style={{ marginLeft: 'auto' }}>← Kembali ke Quiz</Link>
      </nav>

      {children}
    </div>
  );
}