// src/app/admin/subjects/page.tsx
'use client';
import { useState, useEffect, FormEvent } from 'react';

interface Subject {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch {
      setMessage('Gagal memuat data pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const url = editingId ? `/api/admin/subjects/${editingId}` : '/api/admin/subjects';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Gagal menyimpan data');
      
      setFormData({ title: '', description: '' });
      setEditingId(null);
      setMessage(editingId ? '✅ Pelajaran berhasil diperbarui.' : '✅ Pelajaran berhasil ditambahkan.');
      fetchData();
    } catch {
      setMessage('❌ Terjadi kesalahan saat menyimpan.');
    }
  };

  const handleEdit = (subject: Subject) => {
    setFormData({ title: subject.title, description: subject.description || '' });
    setEditingId(subject.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pelajaran ini? Pertemuan & soal di dalamnya tidak akan dihapus otomatis.')) return;
    try {
      await fetch(`/api/admin/subjects/${id}`, { method: 'DELETE' });
      setMessage('✅ Pelajaran berhasil dihapus.');
      fetchData();
    } catch {
      setMessage('❌ Gagal menghapus pelajaran.');
    }
  };

  return (
    <div className="card">
      <h2>{editingId ? 'Edit Pelajaran' : 'Tambah Pelajaran Baru'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Nama Pelajaran *</label>
          <input 
            className="form-input" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Deskripsi (Opsional)</label>
          <input 
            className="form-input" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Simpan Perubahan' : 'Tambahkan'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ title: '', description: '' }); }}>Batal</button>}
        </div>
      </form>

      {message && <p style={{ marginTop: '1rem', fontWeight: 500 }}>{message}</p>}

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Daftar Pelajaran</h3>
      {loading ? <p>Memuat...</p> : subjects.length === 0 ? <p>Belum ada pelajaran.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subjects.map(s => (
            <div key={s.id} className="meeting-item" style={{ background: 'var(--bg-white)' }}>
              <div>
                <strong>{s.title}</strong>
                {s.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{s.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => handleEdit(s)}>Edit</button>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDelete(s.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}