import styles from './OptionButton.module.css';

type OptionButtonProps = {
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function OptionButton({ isCorrect, isSelected, disabled, onClick, children }: OptionButtonProps) {
  let className = styles.button;

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
    >
      {children}
    </button>
  );
}
