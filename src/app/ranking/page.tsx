import Link from 'next/link';

export default function Home() {
  const quizTypes = [
    { id: 'flags', name: 'Флаги' },
    { id: 'capitals', name: 'Столицы' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>MapMind</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {quizTypes.map((quiz) => (
          <Link 
            key={quiz.id}
            href={`/quiz/${quiz.id}`}
            style={{
              padding: '20px',
              background: '#3498db',
              color: 'white',
              textAlign: 'center',
              borderRadius: '8px'
            }}
          >
            {quiz.name}
          </Link>
        ))}
      </div>
    </div>
  );
}