import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 }
    );
  }

  const { name } = await request.json();

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Имя должно содержать минимум 2 символа" },
      { status: 400 }
    );
  }

 try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: name.trim() },
    });

    // Возвращаем полные данные пользователя
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error updating name:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении имени" },
      { status: 500 }
    );
  }
}