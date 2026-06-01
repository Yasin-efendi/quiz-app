'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Question {
  id: string;
  meetingId: string;
  content: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Meeting {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
}

export default function ResultPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiscussion, setShowDiscussion] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('quiz_answers');
    if (!stored) { router.push('/'); return; }
    setAnswers(JSON.parse(stored));

    fetch(`/api/quiz/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { router.push('/'); return; }
        setMeeting(data.meeting);
        setQuestions(data.questions);
        setLoading(false);
      });
  }, [slug, router]);

  const handleRetry = () => {
    router.push(`/quiz/${slug}`);
  };

  if (loading) return <div className="container"><p>Memuat hasil...</p></div>;
  if (!meeting || questions.length === 0) return null;

  const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
  const score = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="container">
      <header className="header">
        <h1>Hasil Quiz</h1>
      </header>

      <div className="card">
        <div className="result-score">{score}</div>
        <div className="result-info">
          <p>Benar: {correctCount} / {questions.length}</p>
          <p>Nilai: {score}/100</p>
        </div>

        <div className="result-actions">
          <button className="btn btn-secondary" onClick={() => setShowDiscussion(!showDiscussion)}>
            {showDiscussion ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan'}
          </button>
          <button className="btn btn-primary" onClick={handleRetry}>Ulangi Quiz</button>
        </div>
      </div>

      {showDiscussion && (
        <div className="card">
          <h2>Pembahasan Soal</h2>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            return (
              <div key={q.id} className="discussion-item">
                <div className="discussion-question" dangerouslySetInnerHTML={{ __html: `Soal ${i + 1}: ${q.content}` }} />
                <p>Jawaban Anda: <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>{q.options[answers[i]] || '-'}</strong></p>
                <p className="discussion-correct">Jawaban Benar: {q.options[q.correctIndex]}</p>
                {q.explanation && (
                  <div className="discussion-explanation" dangerouslySetInnerHTML={{ __html: q.explanation }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}