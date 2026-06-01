// src/app/admin/meetings/page.tsx
'use client';
import { useState, useEffect, FormEvent } from 'react';

interface Subject { id: string; title: string; }
interface Meeting { id: string; subjectId: string; title: string; slug: string; }

export default function AdminMeetingsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', subjectId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      setSubjects(data.subjects || []);
      setMeetings(data.meetings || []);
    } catch {
      setMessage('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subjectId) {
      setMessage('❌ Semua field wajib diisi.');
      return;
    }
    setMessage('');
    try {
      const url = editingId ? `/api/admin/meetings/${editingId}` : '/api/admin/meetings';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Gagal menyimpan data');
      
      setFormData({ title: '', subjectId: '' });
      setEditingId(null);
      setMessage(editingId ? '✅ Pertemuan berhasil diperbarui.' : '✅ Pertemuan berhasil ditambahkan.');
      fetchData();
    } catch {
      setMessage('❌ Terjadi kesalahan saat menyimpan.');
    }
  };

  const handleEdit = (m: Meeting) => {
    setFormData({ title: m.title, subjectId: m.subjectId });
    setEditingId(m.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pertemuan ini? Semua soal terkait akan ikut terhapus.')) return;
    try {
      await fetch(`/api/admin/meetings/${id}`, { method: 'DELETE' });
      setMessage('✅ Pertemuan berhasil dihapus.');
      fetchData();
    } catch {
      setMessage('❌ Gagal menghapus pertemuan.');
    }
  };

  const getSubjectTitle = (subjectId: string) => subjects.find(s => s.id === subjectId)?.title || 'Tidak diketahui';

  return (
    <div className="card">
      <h2>{editingId ? 'Edit Pertemuan' : 'Tambah Pertemuan Baru'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Pilih Pelajaran *</label>
          <select 
            className="form-input" 
            value={formData.subjectId} 
            onChange={e => setFormData({...formData, subjectId: e.target.value})} 
            required
          >
            <option value="">-- Pilih Pelajaran --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Nama Pertemuan *</label>
          <input 
            className="form-input" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Simpan Perubahan' : 'Tambahkan'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ title: '', subjectId: '' }); }}>Batal</button>}
        </div>
      </form>

      {message && <p style={{ marginTop: '1rem', fontWeight: 500 }}>{message}</p>}

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Daftar Pertemuan</h3>
      {loading ? <p>Memuat...</p> : meetings.length === 0 ? <p>Belum ada pertemuan.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {meetings.map(m => (
            <div key={m.id} className="meeting-item" style={{ background: 'var(--bg-white)' }}>
              <div>
                <strong>{m.title}</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📚 {getSubjectTitle(m.subjectId)}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => handleEdit(m)}>Edit</button>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDelete(m.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}