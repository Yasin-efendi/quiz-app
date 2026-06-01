// src/app/admin/page.tsx
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="grid-subjects" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <div className="card">
        <h3>📚 Manajemen Pelajaran</h3>
        <p>Tambah, edit, dan hapus mata pelajaran utama.</p>
        <Link href="/admin/subjects" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Kelola Pelajaran</Link>
      </div>
      <div className="card">
        <h3>📅 Manajemen Pertemuan</h3>
        <p>Atur daftar pertemuan/subtema di dalam setiap pelajaran.</p>
        <Link href="/admin/meetings" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Kelola Pertemuan</Link>
      </div>
      <div className="card">
        <h3>❓ Bank Soal</h3>
        <p>Tambah, edit, hapus soal beserta kunci jawaban & pembahasan.</p>
        <Link href="/admin/questions" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Kelola Bank Soal</Link>
      </div>
    </div>
  );
}