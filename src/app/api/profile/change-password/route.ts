// app/api/profile/change-password/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Необходима авторизация" },
      { status: 401 }
    );
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Все поля обязательны для заполнения" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { message: "Пароль должен содержать минимум 6 символов" },
      { status: 400 }
    );
  }

  try {
    // Получаем текущего пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    if (!currentPassword) {
      return NextResponse.json(
        { message: "Текущий пароль неверный" },
        { status: 400 }
      );
    }

    // Обновляем пароль
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: newPassword },
    });

    return NextResponse.json(
      { message: "Пароль успешно изменен" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "Ошибка при изменении пароля" },
      { status: 500 }
    );
  }
}