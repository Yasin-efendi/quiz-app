// src/app/result/[slug]/error.tsx
'use client';
import { useEffect } from 'react';

export default function ResultError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Result Error:', error);
  }, [error]);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>⚠️ Gagal Menampilkan Hasil</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {error.message || 'Data hasil kuis tidak dapat diproses.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => reset()}>🔄 Coba Lagi</button>
          <a href="/" className="btn btn-secondary">← Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
}