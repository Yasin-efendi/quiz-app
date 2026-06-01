// src/app/quiz/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>⏳ Memuat soal kuis...</p>
        <div className="spinner" />
      </div>
    </div>
  );
}