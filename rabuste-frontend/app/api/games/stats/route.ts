import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/src/lib/mongodb";
import GameCompletion from "@/src/models/GameCompletion";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const stats = await GameCompletion.aggregate([
      { $match: { userId: decoded.userId } },
      {
        $group: {
          _id: "$gameType",
          count: { $sum: 1 },
        },
      },
    ]);

    const gameStats = {
      memory: 0,
      trivia: 0,
      origin: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      gameStats[stat._id as keyof typeof gameStats] = stat.count;
      gameStats.total += stat.count;
    });

    return NextResponse.json(gameStats);
  } catch (error: any) {
    console.error("Get game stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game stats" },
      { status: 500 }
    );
  }
}
