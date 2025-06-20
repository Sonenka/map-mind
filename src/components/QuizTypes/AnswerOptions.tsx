import styles from './styles.module.css';
import { QuestionType } from '@/lib/types';
import OptionButton from '../buttons/OptionButton/OptionButton';

type Props = {
  question: QuestionType;
  selectedIndex: number | null;
  correctIndex: number | null;
  isImage: boolean;
  onSelect: (isCorrect: boolean, index: number) => void;
};

export default function AnswerOptions({
  question,
  selectedIndex,
  correctIndex,
  isImage,
  onSelect,
}: Props) {
  const getOptionProps = (index: number) => ({
    key: index,
    isCorrect: index === correctIndex,
    isSelected: index === selectedIndex,
    disabled: selectedIndex !== null,
    onClick: () =>
      selectedIndex === null &&
      onSelect(question.options[index] === question.correct, index),
  });

  return (
    <div className={isImage ? styles.imageOptions : styles.textOptions}>
      {question.options.map((option, index) => (
        <OptionButton {...getOptionProps(index)}>
          {isImage ? (
            <img
              src={option}
              alt={`Вариант ${index + 1}`}
              className={styles.flagImage}
              onError={(e) => {
                e.currentTarget.src = '/default-flag.png';
              }}
            />
          ) : (
            option
          )}
        </OptionButton>
      ))}
    </div>
  );
}
