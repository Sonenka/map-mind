'use client';

import Link from 'next/link';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

import Input from "@/components/Input/page";
import ErrorMessage from "@/components/ErrorMessage/Page";
import MenuButton from '@/components/buttons/MenuButton/MenuButton';

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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Вход</h1>
        <ErrorMessage text={error} />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button className={styles.button} onClick={handleLogin}>
          Войти
        </button>

        <p className={styles.registerLink}>
          Еще нет аккаунта? <Link href="/auth/register">Зарегистрируйтесь</Link>
        </p>
      </div>
      <MenuButton href='/' variant="back">
        Назад
      </MenuButton>
    </div>
  );
}
