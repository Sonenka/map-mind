import Link from 'next/link';
import styles from './MenuButton.module.css';

type ButtonProps = {
  variant?: 'default' | 'back' | 'small';
  children: React.ReactNode;
  href?: string;
};

export default function MenuButton({ variant = 'default', children, href = '/'}: ButtonProps) {
  const className = `${styles.button} ${styles[variant]}`;
  return (
    <Link href={href!} className={className}>
      {children}
    </Link>
  );
}
