import Link from 'next/link';
import styles from './MenuButton.module.css';

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: 'default' | 'back' | 'disabled';
};

export default function MenuButton({ href, children, variant = 'default' }: Props) {
  let className = '';
  if (variant === 'default') className = styles.button;
  else if (variant === 'back') className = styles.back;
  else if (variant === 'disabled') className = styles.disabled;

  if (variant === 'disabled') {
    return (
      <button disabled className={className}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href!} className={className}>
      {children}
    </Link>
  );
}
