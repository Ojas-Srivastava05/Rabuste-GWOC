import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Menu from "@/src/models/Menu";

// Import the notification service
async function notifyUsersAboutNewItem(item: any, type: 'menu' | 'artwork') {
  try {
    const { notifyUsers } = await import('@/src/utils/notificationService');
    await notifyUsers(type, item);
  } catch (error) {
    console.error('Failed to send notifications:', error);
  }
}

export async function GET() {
  try {
    // 1️⃣ connect to database
    await connectDB();

    // 2️⃣ fetch only available items (or all items if isAvailable field doesn't exist)
    let menu;
    try {
      menu = await Menu.find({ isAvailable: { $ne: false } }).sort({
        category: 1,
        name: 1,
      }).lean();
    } catch (queryError) {
      // If query fails, try without isAvailable filter
      console.warn("Query with isAvailable failed, trying without filter:", queryError);
      menu = await Menu.find({}).sort({
        category: 1,
        name: 1,
      }).lean();
    }

    // 3️⃣ return response with cache headers for CDN
    return NextResponse.json(menu || [], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60',
      },
    });
  } catch (error: any) {
    console.error("Error fetching menu:", error);
    
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json(
      { error: "Failed to fetch menu", message: error?.message || "Unknown error" },
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

    console.log("✅ Menu item created:", newItem._id);

    // 3️⃣ Send email notifications to all users (non-blocking)
    // Convert Mongoose document to plain object
    const itemForEmail = {
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      image: newItem.image,
      category: newItem.category
    };

    // Send notifications in background
    notifyUsersAboutNewItem(itemForEmail, 'menu')
      .then(() => console.log("📧 Notification emails queued"))
      .catch(err => console.error("❌ Notification error:", err));

    // 4️⃣ return created item immediately
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}