import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    
    // Call the public AI discount endpoint (not the admin one)
    const res = await axios.get(`${backendURL}/api/ai-discount`);
    const aiConfig = res.data;

    // Return only the relevant discount information for public use
    // Ensure discountItemId is converted to string for comparison
    return NextResponse.json({
      enableDiscountAI: aiConfig.enableDiscountAI || false,
      discountItemId: aiConfig.discountItemId ? String(aiConfig.discountItemId) : null,
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