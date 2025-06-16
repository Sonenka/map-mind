'use client';

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "./AuthPage.module.css";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshSession = async () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
      setNewName(session.user.name);
    }
  }, [session]);

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      setError("Имя не может быть пустым");
      return;
    }

    try {
      const res = await fetch("/api/profile/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        // Обновляем сессию и ждем завершения
        await update({ 
          name: newName,
          // Добавляем другие поля сессии, если нужно
          email: session?.user?.email 
        });
        
        // Принудительно обновляем состояние
        setName(newName);
        setIsEditingName(false);
        setSuccess("Имя успешно обновлено");
        await refreshSession();
        setTimeout(() => setSuccess(""), 3000);
        
        // Добавляем принудительный рефетч сессии
        const newSession = await fetch("/api/auth/session").then(res => res.json());
        await update(newSession);
        
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Ошибка при обновлении имени");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Произошла ошибка при соединении с сервером");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    if (newPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают");
      return;
    }

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setSuccess("Пароль успешно изменен");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangingPassword(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Ошибка при изменении пароля");
      }
    } catch (err) {
      setError("Произошла ошибка при соединении с сервером");
    }
  };

  const handleAccountDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.")) {
      return;
    }

    try {
      const res = await fetch("/api/profile/delete-account", {
        method: "DELETE",
      });

      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Ошибка при удалении аккаунта");
      }
    } catch (err) {
      setError("Произошла ошибка при соединении с сервером");
    }
  };

  if (status === "loading") return <p className={styles.title}>Загрузка...</p>;
  if (!session) return <p className={styles.title}>Пожалуйста, войдите</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профиль</h1>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <div className={styles.profileSection}>
        <h2>Основная информация</h2>
        <p>Email: {session.user?.email}</p>
        
        {isEditingName ? (
          <div className={styles.editField}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleNameUpdate} className={styles.smallButton}>
              Сохранить
            </button>
            <button 
              onClick={() => setIsEditingName(false)} 
              className={styles.secondarySmallButton}
            >
              Отмена
            </button>
          </div>
        ) : (
          <div className={styles.editField}>
            <p>Имя: {name}</p>
            <button 
              onClick={() => setIsEditingName(true)} 
              className={styles.smallButton}
            >
              Изменить имя
            </button>
          </div>
        )}
      </div>

      <div className={styles.profileSection}>
        <h2>Безопасность</h2>
        
        {isChangingPassword ? (
          <div className={styles.passwordSection}>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Текущий пароль"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Подтвердите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleButton}
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
            
            <div className={styles.buttonGroup}>
              <button onClick={handlePasswordChange} className={styles.smallButton}>
                Сохранить пароль
              </button>
              <button 
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }} 
                className={styles.secondarySmallButton}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChangingPassword(true)} 
            className={styles.smallButton}
          >
            Изменить пароль
          </button>
        )}
      </div>

      <div className={styles.profileSection}>
        <h2>Удаление аккаунта</h2>
        <p>Это действие нельзя отменить. Все ваши данные будут удалены.</p>
        
        {isDeleting ? (
          <div className={styles.deleteConfirmation}>
            <p>Вы уверены, что хотите удалить аккаунт?</p>
            <div className={styles.buttonGroup}>
              <button 
                onClick={handleAccountDelete} 
                className={styles.dangerButton}
              >
                Да, удалить
              </button>
              <button 
                onClick={() => setIsDeleting(false)} 
                className={styles.secondarySmallButton}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsDeleting(true)} 
            className={styles.dangerButton}
          >
            Удалить аккаунт
          </button>
        )}
      </div>

      <button className={styles.button} onClick={() => signOut()}>
        Выйти
      </button>
    </div>
  );
}