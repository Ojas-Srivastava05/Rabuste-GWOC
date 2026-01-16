/**
 * Order Token Generation Utility
 * Generates daily serial tokens in format: XXX (001, 002, 003...)
 * Resets to 001 every day
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
 * Get start and end of today for date range query
 */
function getTodayDateRange() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { startOfDay, endOfDay };
}

/**
 * Generate a unique order token for today
 * Format: XXX (001, 002, 003...)
 * Resets to 001 every day
 * 
 * @returns Promise<string> - Token in format XXX
 */
export async function generateOrderToken(): Promise<string> {
  await connectDB();
  
  const { startOfDay, endOfDay } = getTodayDateRange();
  
  console.log('🎫 Generating token for date range:', {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString()
  });
  
  // Retry up to 5 times to handle race conditions
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      // Find all orders created today and get the count
      const todayOrdersCount = await Order.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });
      
      console.log(`🎫 Found ${todayOrdersCount} orders today (attempt ${attempt + 1})`);
      
      // Next serial number is count + 1
      const serialNumber = todayOrdersCount + 1;
      
      // Format: XXX (pad to 3 digits)
      const token = String(serialNumber).padStart(3, '0');
      
      console.log(`🎫 Generated token: ${token}`);
      
      // Verify this token doesn't already exist for today
      const existingOrder = await Order.findOne({
        token,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).lean().exec();
      
      if (!existingOrder) {
        console.log(`✅ Token ${token} is unique for today`);
        return token;
      }
      
      console.log(`⚠️ Token ${token} already exists, retrying...`);
      
      // If token exists, wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    } catch (error) {
      console.error(`❌ Token generation attempt ${attempt + 1} failed:`, error);
      if (attempt === 4) {
        throw error;
      }
    }
  }
  
  // Fallback: use timestamp-based token
  const timestamp = Date.now().toString().slice(-3);
  console.log(`⚠️ Using fallback token: ${timestamp}`);
  return timestamp;
}

/**
 * Validate token format
 * @param token - Token to validate
 * @returns boolean - True if valid format
 */
export function validateTokenFormat(token: string): boolean {
  // Format: XXX (3 digits)
  const tokenRegex = /^\d{3}$/;
  return tokenRegex.test(token);
}

/**
 * Get today's token prefix for display
 * @returns string - Today's date in YYYYMMDD format
 */
export function getTodayTokenPrefix(): string {
  return getTodayDateString();
}
