import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Menu from "@/src/models/Menu";

export async function GET() {
  try {
    // 1️⃣ connect to database
    await connectDB();

    // 2️⃣ fetch only available items
    const menu = await Menu.find({ isAvailable: true }).sort({
      category: 1,
      name: 1,
    });

    // 3️⃣ return response
    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    try {
      await connectDB();
  
      const body = await req.json();
  
      const { name, description, price, image, category } = body;
  
      // 1️⃣ basic validation
      if (!name || !description || !price || !image || !category) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }
  
      // 2️⃣ create menu item
      const newItem = await Menu.create({
        name,
        description,
        price,
        image,
        category,
        isAvailable: true,
      });
  
      // 3️⃣ return created item
      return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
      console.error("Error creating menu item:", error);
      return NextResponse.json(
        { error: "Failed to create menu item" },
        { status: 500 }
      );
    }
  }
  
