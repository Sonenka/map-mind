'use client';

import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Загрузка...</p>;
  if (!session) return <p>Пожалуйста, войдите</p>;

  return (
    <div>
      <h1>Профиль</h1>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Выйти</button>
    </div>
  );
}
