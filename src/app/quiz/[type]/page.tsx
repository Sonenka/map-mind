import CapitalsQuiz from '@/components/QuizTypes/CapitalsQuiz';
import FlagsQuiz from '@/components/QuizTypes/FlagsQuiz';
import PhotosQuiz from '@/components/QuizTypes/PhotosQuiz';
import ContoursQuiz from '@/components/QuizTypes/ContoursQuiz';

export default function QuizPage({ params }: { params: { type: string } }) {
  const { type } = params;

  switch (type) {
    case 'capitals':
      return <CapitalsQuiz />;
    case 'flags':
      return <FlagsQuiz />;
    case 'photos':
      return <PhotosQuiz />;
    case 'contours':
      return <ContoursQuiz />;
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
}
