'use client';

import { useSession, signOut } from "next-auth/react";
import styles from "./AuthPage.module.css";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className={styles.title}>Загрузка...</p>;
  if (!session) return <p className={styles.title}>Пожалуйста, войдите</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профиль</h1>
      <p style={{ marginBottom: "16px" }}>Email: {session.user?.email}</p>
      <button className={styles.button} onClick={() => signOut()}>
        Выйти
      </button>
    </div>
  );
}
