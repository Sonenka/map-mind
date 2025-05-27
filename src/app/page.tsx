import Link from 'next/link';

export default function Home() {
  const quizTypes = [
    { id: 'capitals', name: 'столицы' },
    { id: 'flags', name: 'флаги' },
    { id: 'photos', name: 'фото' },
    { id: 'contours', name: 'контур' },
    { id: 'multiplayer', name: 'мультиплеер' },
    { id: 'secret', name: 'секрет' }
  ];

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>MapMind</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {quizTypes.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/quiz/${quiz.id}`}
            style={{
              padding: '20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.2rem'
            }}
          >
            {quiz.name}
          </Link>
        ))}
      </div>

      <Link
        href="/ranking"
        style={{
          padding: '15px 30px',
          backgroundColor: '#2ecc71',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          display: 'inline-block'
        }}
      >
        Рейтинг
      </Link>
    </div>
  );
}