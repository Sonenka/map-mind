'use client';

import Link from 'next/link';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Неверный логин или пароль");
    } else {
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход</h1>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        className={styles.input}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        className={styles.input}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.button} onClick={handleLogin}>
        Войти
      </button>
      <p className={styles.registerLink}>
        Еще нет аккаунта? <Link href="/auth/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
}
