import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });
  return NextResponse.json(user);
}