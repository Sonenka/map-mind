'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const allowedEmails = ['sonenkkaa@gmail.com', 'clashoc2812@gmail.com', 'garfild0407@gmail.com', 'ivangorylev@gmail.com'];

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || !allowedEmails.includes(session.user.email ?? '')) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || !allowedEmails.includes(session?.user?.email ?? '')) {
    return <p style={{ textAlign: 'center' }}>Загрузка...</p>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Админ панель MapMind</h1>

      <div className={styles.adminGrid}>
        <AdminCard
          title="Управление вопросами"
          description="Добавление, редактирование и удаление вопросов"
          href="/admin/questions"
        />
        <AdminCard
          title="Управление пользователями"
          description="Добавление, редактирование и удаление пользователей"
          href="/admin/users"
        />
      </div>
    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className={styles.adminCardLink}>
      <div className={styles.adminCard}>
        <h2 className={styles.adminCardTitle}>{title}</h2>
        <p className={styles.adminCardDescription}>{description}</p>
      </div>
    </Link>
  );
}
