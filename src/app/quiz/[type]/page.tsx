import QuizGame from '@/app/components/Quiz';

interface PageProps {
  params: {
    type: string;
  };
}

export default async function QuizPage({ params }: PageProps) {
  const { type } = await params;

  if (!type || typeof type !== 'string') {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: 'red'
      }}>
        <h2>Ошибка: Неверный URL</h2>
        <p>Попробуйте открыть страницу через меню выбора викторины</p>
        <a href="/">На главную</a>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <QuizGame quizType={type} />
    </div>
  );
}
