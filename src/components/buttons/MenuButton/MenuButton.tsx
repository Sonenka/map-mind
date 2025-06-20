import Link from 'next/link';
import styles from './MenuButton.module.css';

type MenuButtonProps =
  | {
      href: string;
      onClick?: never;
      variant?: 'default' | 'back' | 'onMain';
      children: React.ReactNode;
    }
  | {
      onClick: () => void;
      href?: never;
      variant?: 'default' | 'back' | 'onMain';
      children: React.ReactNode;
    };

export default function MenuButton({ href, onClick, variant = 'default', children }: MenuButtonProps) {
  const className = `${styles.button} ${styles[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
