import styles from './styles.module.css';

type OptionButtonProps = {
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function OptionButton({ isCorrect, isSelected, disabled, onClick, children }: OptionButtonProps) {
  let className = styles.option;

  if (disabled) {
    if (isCorrect) {
      className += ` ${styles.correct}`;
    } else if (isSelected && !isCorrect) {
      className += ` ${styles.incorrect}`;
    }
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
