'use client';
import { useState, useEffect, FormEvent } from 'react';

interface Subject { id: string; title: string; }
interface Meeting { id: string; subjectId: string; title: string; }
interface Question { 
  id: string; 
  meetingId: string; 
  content: string; 
  options: string[]; 
  correctIndex: number; 
  explanation: string; 
}

export default function AdminQuestionsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    meetingId: '',
    content: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      setSubjects(data.subjects || []);
      setMeetings(data.meetings || []);
      setQuestions(data.questions || []);
    } catch {
      setMessage('❌ Gagal memuat data bank soal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateOption = (idx: number, value: string) => {
    const newOpts = [...formData.options];
    newOpts[idx] = value;
    setFormData({ ...formData, options: newOpts });
  };

  const resetForm = () => {
    setFormData({ meetingId: '', content: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.meetingId || !formData.content || formData.options.some(o => !o.trim())) {
      setMessage('❌ Pastikan Pelajaran, Soal, dan ke-4 Opsi terisi.');
      return;
    }

    setMessage('');
    try {
      const url = editingId ? `/api/admin/questions/${editingId}` : '/api/admin/questions';
      const method = editingId ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        correctIndex: Number(formData.correctIndex), // Pastikan tipe number
        options: formData.options.map(o => o.trim())
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Gagal menyimpan soal');
      
      resetForm();
      setMessage(editingId ? '✅ Soal berhasil diperbarui.' : '✅ Soal berhasil ditambahkan.');
      fetchData();
    } catch {
      setMessage('❌ Terjadi kesalahan saat menyimpan soal.');
    }
  };

  const handleEdit = (q: Question) => {
    setFormData({
      meetingId: q.meetingId,
      content: q.content,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation
    });
    setEditingId(q.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;
    try {
      await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      setMessage('✅ Soal berhasil dihapus.');
      fetchData();
    } catch {
      setMessage('❌ Gagal menghapus soal.');
    }
  };

  const getMeetingTitle = (id: string) => meetings.find(m => m.id === id)?.title || 'Tidak diketahui';
  const getSubjectTitle = (subjectId: string) => subjects.find(s => s.id === subjectId)?.title || '';

  return (
    <div className="card">
      <h2>{editingId ? '✏️ Edit Soal' : '➕ Tambah Soal Baru'}</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        💡 Anda bisa menggunakan tag HTML sederhana seperti <code>&lt;br&gt;</code>, <code>&lt;b&gt;</code>, atau <code>&lt;i&gt;</code> pada kolom Soal & Pembahasan.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Target Pertemuan *</label>
          <select 
            className="form-input" 
            value={formData.meetingId} 
            onChange={e => setFormData({...formData, meetingId: e.target.value})} 
            required
          >
            <option value="">-- Pilih Pertemuan --</option>
            {subjects.map(s => (
              <optgroup key={s.id} label={s.title}>
                {meetings.filter(m => m.subjectId === s.id).map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Soal (Content) *</label>
          <textarea 
            className="form-input" 
            rows={3} 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Opsi Jawaban *</label>
          {formData.options.map((opt, idx) => (
            <input
              key={idx}
              className="form-input"
              style={{ marginBottom: '0.5rem' }}
              placeholder={`Opsi ${idx + 1}`}
              value={opt}
              onChange={e => updateOption(idx, e.target.value)}
              required
            />
          ))}
        </div>

        <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Jawaban Benar: </label>
          <select 
            className="form-input" 
            style={{ width: 'auto' }}
            value={formData.correctIndex} 
            onChange={e => setFormData({...formData, correctIndex: Number(e.target.value)})} 
            required
          >
            {[0,1,2,3].map(i => <option key={i} value={i}>Opsi {i + 1}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Pembahasan (Opsional)</label>
          <textarea 
            className="form-input" 
            rows={3} 
            value={formData.explanation} 
            onChange={e => setFormData({...formData, explanation: e.target.value})} 
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Simpan Perubahan' : 'Tambah Soal'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Batal</button>}
        </div>
      </form>

      {message && <p style={{ marginTop: '1rem', fontWeight: 500 }}>{message}</p>}

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Daftar Bank Soal ({questions.length})</h3>
      {loading ? <p>Memuat...</p> : questions.length === 0 ? <p>Belum ada soal.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {questions.map(q => (
            <div key={q.id} className="meeting-item" style={{ background: 'var(--bg-white)', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  📚 {getSubjectTitle(meetings.find(m => m.id === q.meetingId)?.subjectId || '')} → {getMeetingTitle(q.meetingId)}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => handleEdit(q)}>Edit</button>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDelete(q.id)}>Hapus</button>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: q.content }} style={{ fontWeight: 500, marginTop: '0.5rem' }} />
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                ✅ Jawaban: <strong>Opsi {q.correctIndex + 1}</strong> ({q.options[q.correctIndex]})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}