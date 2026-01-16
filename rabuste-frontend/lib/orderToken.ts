/**
 * Order Token Generation Utility
 * Generates daily serial tokens in format: YYYYMMDD-XXX
 * Example: 20260117-005
 */

import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";

/**
 * Get the current date in YYYYMMDD format
 */
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Generate a unique order token for today
 * Uses retry logic to handle race conditions
 * 
 * @returns Promise<string> - Token in format YYYYMMDD-XXX
 */
export async function generateOrderToken(): Promise<string> {
  await connectDB();
  
  const today = getTodayDateString();
  const tokenPrefix = `${today}-`;
  
  // Retry up to 5 times to handle race conditions
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      // Find the highest serial number for today
      const lastOrder = await Order.findOne({
        token: { $regex: `^${tokenPrefix}` }
      })
        .sort({ createdAt: -1, token: -1 })
        .select('token')
        .lean()
        .exec();
      
      let serialNumber = 1;
      
      if (lastOrder && lastOrder.token) {
        // Extract the serial number from the last token
        const parts = lastOrder.token.split('-');
        if (parts.length === 2) {
          const lastSerial = parseInt(parts[1], 10);
          if (!isNaN(lastSerial)) {
            serialNumber = lastSerial + 1;
          }
        }
      }
      
      // Format: YYYYMMDD-XXX (pad to 3 digits)
      const token = `${tokenPrefix}${String(serialNumber).padStart(3, '0')}`;
      
      // Verify this token doesn't already exist
      const existingOrder = await Order.findOne({ token }).lean().exec();
      if (!existingOrder) {
        return token;
      }
      
      // If token exists, wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    } catch (error) {
      console.error(`Token generation attempt ${attempt + 1} failed:`, error);
      if (attempt === 4) {
        throw error;
      }
    }
  }
  
  // Fallback: use timestamp-based token
  const timestamp = Date.now().toString().slice(-6);
  return `${tokenPrefix}${timestamp}`;
}

/**
 * Validate token format
 * @param token - Token to validate
 * @returns boolean - True if valid format
 */
export function validateTokenFormat(token: string): boolean {
  // Format: YYYYMMDD-XXX
  const tokenRegex = /^\d{8}-\d{3}$/;
  return tokenRegex.test(token);
}

/**
 * Extract date from token
 * @param token - Token to parse
 * @returns Date object or null if invalid
 */
export function getDateFromToken(token: string): Date | null {
  if (!validateTokenFormat(token)) {
    return null;
  }
  
  const dateString = token.split('-')[0];
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // JS months are 0-indexed
  const day = parseInt(dateString.substring(6, 8), 10);
  
  return new Date(year, month, day);
}
