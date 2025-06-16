import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {

    await prisma.user.delete({
      where: { id: params.userId },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Ошибка при удалении пользователя' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}