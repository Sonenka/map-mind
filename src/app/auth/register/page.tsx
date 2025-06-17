'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Валидация
    if (!name || !email || !password || !confirmPassword) {
      setError("Все поля обязательны для заполнения");
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
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Ошибка регистрации");
      }
    } catch (err) {
      setError("Произошла ошибка при соединении с сервером");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>
      {error && <p className={styles.error}>{error}</p>}
      
      <input
        type="text"
        placeholder="Имя"
        value={name}
        className={styles.input}
        onChange={(e) => setName(e.target.value)}
      />
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        className={styles.input}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <div className={styles.passwordContainer}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Пароль"
          value={password}
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="button" 
          onClick={togglePasswordVisibility}
          className={styles.toggleButton}
        >
          {showPassword ? "Скрыть" : "Показать"}
        </button>
      </div>
      
      <div className={styles.passwordContainer}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          className={styles.input}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button 
          type="button" 
          onClick={toggleConfirmPasswordVisibility}
          className={styles.toggleButton}
        >
          {showConfirmPassword ? "Скрыть" : "Показать"}
        </button>
      </div>
      
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