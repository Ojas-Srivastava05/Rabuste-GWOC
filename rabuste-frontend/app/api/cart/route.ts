import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/src/lib/mongodb";
import Cart from "@/src/models/Cart";
import Menu from "@/src/models/Menu";
import Art from "@/src/models/Art";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ items: [], totalAmount: 0 });
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ items: [], totalAmount: 0 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ items: [], totalAmount: 0 }, { status: 200 }); // Return empty cart on error
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 400 });
    }

    const { menuItemId, artItemId, quantity } = await req.json();

    // Get AI discount configuration
    let aiDiscount = { enableDiscountAI: false, discountItemId: null, discountPercent: 0 };
    try {
      const discountRes = await fetch('http://localhost:3000/api/ai-discount');
      if (discountRes.ok) {
        const discountData = await discountRes.json();
        // Ensure discountItemId is converted to string
        aiDiscount = {
          enableDiscountAI: discountData.enableDiscountAI || false,
          discountItemId: discountData.discountItemId ? String(discountData.discountItemId) : null,
          discountPercent: discountData.discountPercent || 0,
        };
      }
    } catch (error) {
      console.warn('Failed to fetch AI discount config:', error);
    }

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = await Cart.create({
        sessionId,
        items: [],
        totalAmount: 0,
      });
    }

  // Handle menu item
  if (menuItemId) {
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      return NextResponse.json({ error: "Invalid menu item" }, { status: 400 });
    }

    // Check if this item is eligible for AI discount
    let itemPrice = menuItem.price;
    let hasAIDiscount = false;
    if (aiDiscount.enableDiscountAI && 
        aiDiscount.discountItemId && 
        String(aiDiscount.discountItemId) === String(menuItemId) && 
        aiDiscount.discountPercent > 0) {
      itemPrice = menuItem.price * (1 - aiDiscount.discountPercent / 100);
      hasAIDiscount = true;
    }

    // Find existing item by ID or by name (for merging duplicates)
    const existingItemById = cart.items.find(
      (item: any) => item.itemType === "menu" && item.menuItem?.toString() === menuItemId
    );

    const existingItemByName = cart.items.find(
      (item: any) => item.itemType === "menu" && item.name === menuItem.name
    );

    const existingItem = existingItemById || existingItemByName;

    if (existingItem) {
      existingItem.quantity += quantity;
      // Update the menuItem reference and apply discount price
      existingItem.menuItem = menuItem._id;
      existingItem.price = itemPrice;
      if (hasAIDiscount) {
        existingItem.aiDiscount = {
          originalPrice: menuItem.price,
          discountPercent: aiDiscount.discountPercent,
          discountedPrice: itemPrice
        };
      }
    
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(
          (item: any) => item !== existingItem
        );
      }
    } else if (quantity > 0) {
      const newItem: any = {
        menuItem: menuItem._id,
        itemType: "menu",
        name: menuItem.name,
        price: itemPrice,
        quantity,
        image: menuItem.image,
      };
      
      // Add AI discount information if applicable
      if (hasAIDiscount) {
        newItem.aiDiscount = {
          originalPrice: menuItem.price,
          discountPercent: aiDiscount.discountPercent,
          discountedPrice: itemPrice
        };
      }
      
      cart.items.push(newItem);
    }
  }

  // Handle art item
  if (artItemId) {
    const artItem = await Art.findById(artItemId);
    if (!artItem || !artItem.isAvailable) {
      return NextResponse.json({ error: "Invalid art item" }, { status: 400 });
    }

    // Find existing item by ID or by name (for merging duplicates)
    const existingItemById = cart.items.find(
      (item: any) => item.itemType === "art" && item.artItem?.toString() === artItemId
    );

    const existingItemByName = cart.items.find(
      (item: any) => item.itemType === "art" && item.name === artItem.title
    );

    const existingItem = existingItemById || existingItemByName;

    if (existingItem) {
      existingItem.quantity += quantity;
      // Update the artItem reference to the current one
      existingItem.artItem = artItem._id;
    
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(
          (item: any) => item !== existingItem
        );
      }
    } else if (quantity > 0) {
      cart.items.push({
        artItem: artItem._id,
        itemType: "art",
        name: artItem.title,
        price: artItem.price,
        quantity,
        image: artItem.images[0],
      });
    }
  }

    cart.totalAmount = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to update cart", details: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
  
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
  
    if (sessionId) {
      await Cart.deleteOne({ sessionId });
    }
  
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete cart" }, { status: 500 });
  }
}
  