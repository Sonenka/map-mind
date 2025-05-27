//src/app/quiz/[type]/page.tsx
import QuizGame from '@/components/QuizGame';

interface PageProps {
  params: {
    type: string;
  };
}

export default function QuizPage({ params }: PageProps) {
  if (!params?.type) {
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
      {/* QuizGame — клиентский компонент */}
      <QuizGame quizType={params.type} />
    </div>
  );
}
