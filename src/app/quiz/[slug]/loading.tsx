// src/app/quiz/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>⏳ Memuat soal kuis...</p>
        <div style={{ margin: '1rem auto', width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}