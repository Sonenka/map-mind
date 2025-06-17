import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const topUsers = await prisma.user.findMany({
    include: {
      results: true,
    },
  });

  const leaderboard = topUsers.map((user) => {
    const totalScore = user.results.reduce((sum, r) => sum + r.score, 0);
    return {
      name: user.name || "Аноним",
      totalScore,
    };
  });

  leaderboard.sort((a, b) => b.totalScore - a.totalScore);

  return NextResponse.json(leaderboard);
}
