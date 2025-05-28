import Link from 'next/link';

export default function Home() {
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
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: -1,
        }}
      />

      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>MapMind</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link
            href="/singleplayer"
            style={{
              padding: '20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '1.3rem'
            }}
          >
            Одиночная игра
          </Link>

          <button
            disabled
            style={{
              padding: '20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.3rem',
              cursor: 'not-allowed'
            }}
          >
            Многопользовательская игра
          </button>

          <Link
            href="/ranking"
            style={{
              padding: '20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '1.3rem'
            }}
          >
            Рейтинг
          </Link>
        </div>
      </div>
    </div>
  );
}
