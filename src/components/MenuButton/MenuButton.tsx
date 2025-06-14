import Link from 'next/link';
import styles from './MenuButton.module.css';

type Props = {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'back';
};

export default function MenuButton({
  href,
  children,
  disabled,
  className,
  variant = 'default',
}: Props) {
  const buttonClass =
    variant === 'default'
      ? `${styles.button} ${className ?? ''}`
      : className ?? '';

  if (disabled) {
    return <button disabled className={buttonClass}>{children}</button>;
  }

  return <Link href={href!} className={buttonClass}>{children}</Link>;
}
