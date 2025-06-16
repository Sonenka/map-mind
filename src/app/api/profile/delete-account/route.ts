// app/api/profile/delete-account/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Необходима авторизация" },
      { status: 401 }
    );
  }

  try {
    // Удаляем пользователя
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    // Здесь можно также удалить все связанные данные пользователя

    return NextResponse.json(
      { message: "Аккаунт успешно удален" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { message: "Ошибка при удалении аккаунта" },
      { status: 500 }
    );
  }
}