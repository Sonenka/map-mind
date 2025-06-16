import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Валидация входных данных
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Имя должно содержать минимум 2 символа" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: password,
      },
    });

    // Возвращаем данные без пароля
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при регистрации" },
      { status: 500 }
    );
  }
}