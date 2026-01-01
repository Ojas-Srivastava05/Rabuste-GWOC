import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Art from "@/src/models/Art";

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
    await connectDB();

    const art = await Art.find({ isAvailable: true }).sort({
      isFeatured: -1,
      createdAt: -1,
    });

    return NextResponse.json(art, { status: 200 });
  } catch (error) {
    console.error("Error fetching art:", error);
    return NextResponse.json(
      { error: "Failed to fetch art gallery" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { title, artist, description, price, images, category, medium, dimensions, year, stock } = body;

    // Validation
    if (!title || !artist || !description || !price || !images || !category) {
      return NextResponse.json(
        { error: "Required fields: title, artist, description, price, images, category" },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const newItem = await Art.create({
      title,
      artist,
      description,
      price,
      images,
      category,
      medium,
      dimensions,
      year,
      stock: stock || 1,
      isAvailable: true,
      isFeatured: false,
    });

    console.log("✅ Art item created:", newItem._id);

    // Convert to plain object for email
    const itemForEmail = {
      title: newItem.title,
      artist: newItem.artist,
      description: newItem.description,
      price: newItem.price,
      image: newItem.images[0],
      category: newItem.category
    };

    // Send notifications in background
    notifyUsersAboutNewItem(itemForEmail, 'artwork')
      .then(() => console.log("📧 Art notification emails queued"))
      .catch(err => console.error("❌ Notification error:", err));

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating art item:", error);
    return NextResponse.json(
      { error: "Failed to create art item" },
      { status: 500 }
    );
  }
}