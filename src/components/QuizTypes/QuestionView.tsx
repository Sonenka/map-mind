import styles from './styles.module.css';
import { QuestionType } from '@/lib/types';

type Props = {
  question: QuestionType;
  isImage: boolean;
};

export default function QuestionView({ question, isImage }: Props) {
  if (isImage) {
    return (
      <div className={styles.imageWrapper}>
        <img
          src={question.image ?? question.question}
          alt="Изображение вопроса"
          className={styles.questionImage}
        />
      </div>
    );
  }

  return <h2 className={styles.questionText}>{question.question}</h2>;
}