import Link from 'next/link';

export default function Singleplayer() {
  const quizTypes = [
    { id: 'capitals', name: 'Столицы' },
    { id: 'flags', name: 'Флаги' },
    { id: 'photos', name: 'Фото' },
    { id: 'contours', name: 'Контур' },
    { id: 'secret', name: 'Секрет' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      >
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }}
      />

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '30px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '30px' }}>Выбери тип квиза</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
        }}>
          {quizTypes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              style={{
                padding: '18px',
                backgroundColor: '#2980b9',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '1.2rem',
              }}
            >
              {quiz.name}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '40px',
            padding: '12px 24px',
            backgroundColor: '#7f8c8d',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          ← Назад
        </Link>
      </div>
    </div>
  );
}
