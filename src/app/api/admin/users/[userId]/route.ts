import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.pathname.split('/').pop();

  if (!userId) {
    return NextResponse.json({ error: 'userId не найден' }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении пользователя' },
      { status: 500 }
    );
  }
}
