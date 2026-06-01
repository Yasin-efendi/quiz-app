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

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quiz/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { router.push('/'); return; }
        setMeeting(data.meeting);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(-1));
        setLoading(false);
      })
      .catch(() => router.push('/'));
  }, [slug, router]);

  if (loading) return <div className="container"><p>Memuat soal...</p></div>;
  if (!meeting || questions.length === 0) return <div className="container"><p>Tidak ada soal untuk pertemuan ini.</p></div>;

  const handleOptionSelect = (optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIdx;
    setAnswers(newAnswers);
  };

  const handlePrev = () => setCurrentIdx(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1));

  const handleSubmit = () => {
    if (answers.includes(-1)) return; // Harus dijawab semua
    sessionStorage.setItem('quiz_answers', JSON.stringify(answers));
    router.push(`/result/${slug}`);
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="container">
      <header className="header">
        <h1>{meeting.title}</h1>
      </header>

      <div className="card">
        <div className="quiz-header">
          <span>Soal {currentIdx + 1}/{questions.length}</span>
          <span className="quiz-progress">{answers.filter(a => a !== -1).length} dijawab</span>
        </div>

        <div className="question-content" dangerouslySetInnerHTML={{ __html: currentQ.content }} />

        <div className="options-list">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-btn ${answers[currentIdx] === idx ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(idx)}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="quiz-nav">
          <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIdx === 0}>
            Sebelumnya
          </button>
          {currentIdx === questions.length - 1 ? (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={answers.includes(-1)}>
              Selesai & Lihat Hasil
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handleNext}>
              Selanjutnya
            </button>
          )}
        </div>
      </div>
    </div>
  );
}