import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const backendURL = "http://localhost:5001";
    
    const res = await axios.get(`${backendURL}/api/admin/ai-config`);
    const aiConfig = res.data;

    // Return only the relevant discount information for public use
    return NextResponse.json({
      enableDiscountAI: aiConfig.enableDiscountAI || false,
      discountItemId: aiConfig.discountItemId || null,
      discountPercent: aiConfig.discountPercent || 0,
    });
  } catch (error) {
    console.error("Failed to fetch AI discount config:", error);
    return NextResponse.json({
      enableDiscountAI: false,
      discountItemId: null,
      discountPercent: 0,
    });
  }
}