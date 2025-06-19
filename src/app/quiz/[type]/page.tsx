import CapitalsQuiz from '@/components/QuizTypes/CapitalsQuiz';
import FlagsQuiz from '@/components/QuizTypes/FlagsQuiz';
import PhotosQuiz from '@/components/QuizTypes/PhotosQuiz';
import MapQuiz from '@/components/QuizTypes/MapQuiz';

export default async function QuizPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const { type } = resolvedParams;

  const QuizComponent = (() => {
    switch (type) {
      case 'capitals':
        return <CapitalsQuiz />;
      case 'flags':
        return <FlagsQuiz />;
      case 'photos':
        return <PhotosQuiz />;
      case 'map':
        return <MapQuiz />;
      default:
        return (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            color: 'red' 
          }}>
            <h2>Ошибка: Неверный тип квиза</h2>
            <p>Попробуйте выбрать тип квиза из меню</p>
            <a href="/">На главную</a>
          </div>
        );
    }
  })();

  return (
    <div style={{ minHeight: '100vh' }}>
      {QuizComponent}
    </div>
  );
}

