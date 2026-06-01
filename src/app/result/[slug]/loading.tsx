// src/app/result/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>📊 Menghitung hasil kuis...</p>
      </div>
    </div>
  );
}