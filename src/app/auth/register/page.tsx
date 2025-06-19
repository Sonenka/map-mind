'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";

import Input from "../../../components/Input/page";
import PasswordInput from "../../../components/PasswordInput/page";
import ErrorMessage from "../../../components/ErrorMessage/Page";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Введите корректный email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Ошибка регистрации");
      }
    } catch (err) {
      setError("Произошла ошибка при соединении с сервером");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>
      <ErrorMessage text={error} />

      <Input
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />

      <PasswordInput
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordInput
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className={styles.button} onClick={handleRegister}>
        Зарегистрироваться
      </button>

      <div className={styles.loginPrompt}>
        <p>Уже зарегистрированы?</p>
        <Link href="/auth/login" className={styles.loginLink}>
          Войдите в аккаунт
        </Link>
      </div>
    </div>
  );
}
