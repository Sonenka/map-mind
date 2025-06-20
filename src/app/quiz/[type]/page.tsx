import CapitalsQuiz from '@/components/QuizTypes/CapitalsQuiz';
import FlagsQuiz from '@/components/QuizTypes/FlagsQuiz';
import PhotosQuiz from '@/components/QuizTypes/PhotosQuiz';
import MapQuiz from '@/components/QuizTypes/MapQuiz';

import MenuButton from '@/components/buttons/MenuButton/MenuButton';

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
    }
  })();

  return (
    <div>
      {QuizComponent}
    </div>
  );
}

