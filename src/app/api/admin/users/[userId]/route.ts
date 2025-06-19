import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

<<<<<<< HEAD
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
=======
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.pathname.split('/').pop();

  if (!userId) {
    return NextResponse.json({ error: 'userId не найден' }, { status: 400 });
  }

>>>>>>> 361b7c84784eb6d484912daf288f70a1633b4944
  try {

    await prisma.user.delete({
      where: { id: params.userId },
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