// import { NextResponse } from "next/server";
// import  connectDB  from "@/src/lib/mongodb";
// import { Workshop } from "@/src/models/Workshop";

// // GET all workshops
// export async function GET() {
//   await connectDB();
//   const workshops = await Workshop.find().sort({ date: 1 });
//   return NextResponse.json(workshops);
// }

// // ADD a new workshop
// export async function POST(req: Request) {
//   await connectDB();
//   const body = await req.json();

//   const workshop = await Workshop.create(body);
//   return NextResponse.json(workshop, { status: 201 });
// }



import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import { Workshop } from "@/src/models/Workshop";

export async function GET() {
  try {
    await connectDB();
    const workshops = await Workshop.find().sort({ date: 1 });
    return NextResponse.json(workshops);
  } catch (error) {
    console.error("❌ GET /api/workshops failed:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const workshop = await Workshop.create(body);
    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/workshops failed:", error);
    return NextResponse.json(
      { error: "Failed to create workshop" },
      { status: 500 }
    );
  }
}
