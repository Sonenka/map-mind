import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  const {
    score,
    currentUserId = null,
    currentUserEmail = null,
  } = await req.json();

  if (session?.user?.email && (currentUserEmail || currentUserId)) {
    return NextResponse.json({ error: "ANTISPAM" }, { status: 499 });
  }

  if (!session?.user?.email && !currentUserEmail) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userEmail = session?.user?.email || currentUserEmail;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (currentUserEmail) {
    if (!currentUserId || !currentUserEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 498 });
    }
    if (currentUserId !== user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 497 });
    }
  }

  const result = await prisma.result.create({
    data: {
      userId: user.id,
      score: score,
    },
  });

  return NextResponse.json(result);
}
