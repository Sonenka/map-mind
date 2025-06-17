// components/PasswordInput.tsx
import { useState } from "react";
import styles from "../../app/auth/auth.module.css";

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({ placeholder, value, onChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.passwordContainer}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className={styles.toggleButton}
      >
        {show ? "Скрыть" : "Показать"}
      </button>
    </div>
  );
}
