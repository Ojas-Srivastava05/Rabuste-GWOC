# Order Token System Documentation

## Overview
The order token system generates sequential daily tokens for orders, starting from 001 each day and incrementing with each new order.

## Token Format

### Storage Format
- Tokens are stored in the database as **3-digit numbers**: `001`, `002`, `003`, etc.
- Tokens reset to `001` at the start of each new day (midnight)

### Display Format
- Tokens are displayed with a date prefix: `YYYYMMDD-XXX`
- Example: `20260117-001` (January 17, 2026, first order)

## How It Works

### Token Generation (`lib/orderToken.ts`)
1. **Count Today's Orders**: Queries the database for orders created today
2. **Calculate Next Number**: Next token = count + 1
3. **Format Token**: Pads the number to 3 digits (e.g., 1 → "001")
4. **Verify Uniqueness**: Checks if token already exists for today
5. **Retry Logic**: If token exists, retries up to 5 times with delays
6. **Fallback**: Uses timestamp-based token if all retries fail

### Token Display (`lib/tokenUtils.ts`)
- `formatTokenForDisplay(token, orderDate)`: Formats "001" → "20260117-001"
- `formatTokenShort(token)`: Formats "001" → "#001"

### Database Schema (`src/models/Order.ts`)
```javascript
token: {
  type: String,
  required: true,
  index: true,  // Not unique globally, only per day
}
```

## Usage Examples

### Creating an Order
```typescript
// In API route
const token = await generateOrderToken(); // Returns "001", "002", etc.
const order = await Order.create({
  ...orderData,
  token
});
```

### Displaying a Token
```typescript
// In UI component
import { formatTokenForDisplay } from '@/lib/tokenUtils';

const displayToken = formatTokenForDisplay(order.token, order.createdAt);
// Returns: "20260117-001"
```

## Key Features

1. **Daily Reset**: Tokens start from 001 every day
2. **Sequential**: Each order gets the next number in sequence
3. **Race Condition Safe**: Retry logic handles concurrent order creation
4. **User-Friendly Display**: Shows date context in the UI
5. **Compact Storage**: Only stores 3-digit number in database

## Debugging

### Check Token Generation
Look for these console logs in the server:
- `🎫 Generating token for date range:`
- `🎫 Found X orders today`
- `🎫 Generated token: XXX`
- `✅ Token XXX is unique for today`

### Check Order Creation
- `✅ Token generated successfully: XXX`
- `✅ API - Order saved successfully:` (includes token field)

## Files Modified

1. `lib/orderToken.ts` - Token generation logic
2. `lib/tokenUtils.ts` - Display formatting utilities
3. `src/models/Order.ts` - Database schema (removed unique constraint)
4. `app/api/orders/route.ts` - Order creation with token generation
5. `components/OrderReceipt.tsx` - Receipt display and PDF generation
6. `app/order-status/page.tsx` - Order status page display
7. `app/receipt/[orderId]/page.tsx` - Receipt page

## Common Issues

### Token Not Sequential
- Check server console for token generation logs
- Verify MongoDB connection is working
- Check if orders are being created with correct timestamps

### Duplicate Tokens
- Should not happen due to retry logic
- If it does, check the retry mechanism in `generateOrderToken()`
- Verify date range queries are working correctly

### Token Not Displaying
- Ensure `formatTokenForDisplay()` is imported and used
- Check that `orderDate` is being passed correctly
- Verify token field exists in the order document
